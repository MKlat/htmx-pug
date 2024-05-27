var express = require("express");
const { Parent, Child } = require("../models");
const prettifyValidationErrors = require("../utils/prettifyValidationErrors");
var router = express.Router();

router.get("/", (req, res, next) => {
  res.render("registration", {
    title: "Anmeldung",
    context: { parent: {}, children: [{}, {}, {}, {}, {}, {}], childCount: 0 },
    errors: {},
  });
});

router.post(
  "/:stepType/:index?/:action",
  async (req, res, next) => {
    let context = req.body.context ? JSON.parse(req.body.context) : {};
    let errors = {};

    switch (req.params.stepType) {
      case "parent":
        const parent = Parent.build(req.body);

        context = {
          ...context,
          parent: parent.toJSON(),
          childCount: req.body.childCount,
        };

        if (req.params.action === "next") {
          if (+req.body.childCount < 1 || +req.body.childCount > 5) {
            errors["childCount"] =
              "Bitte wählen Sie aus, wie viele Kinder Sie anmelden möchten.";
          }

          try {
            await parent.validate();
          } catch (e) {
            errors = { ...errors, ...prettifyValidationErrors(e.errors) };

            res.render("steps/parent", { context, errors });
            break;
          }

          res.render("steps/child", {
            childIndex: 1,
            context,
            errors,
          });
        } else {
          res.render("error");
        }

        break;

      case "child":
        const child = Child.build(req.body);

        context.children[+req.params.index] = child.toJSON();

        if (req.params.action === "next") {
          try {
            await child.validate();
          } catch (e) {
            errors = prettifyValidationErrors(e.errors);

            res.render("steps/child", {
              childIndex: req.params.index,
              context,
              errors,
            });
            break;
          }
        }

        const nextIndex =
          req.params.action === "prev"
            ? +req.params.index - 1
            : +req.params.index + 1;

        if (nextIndex <= 0) {
          res.render("steps/parent", { context, errors });
        } else if (nextIndex > context.childCount) {
          res.render("steps/summary", { context, errors });
        } else {
          res.render("steps/child", { context, childIndex: nextIndex, errors });
        }

        break;

      case "summary":
        context.hasAgreedToPhotos = !!req.body.hasAgreedToPhotos;
        context.hasAgreedToMedicalTreatment = !!req.body.hasAgreedToMedicalTreatment;
        context.hasAgreedToRegistration = !!req.body.hasAgreedToRegistration;

        if (req.params.action === "prev") {
          res.render("steps/child", {
            context,
            childIndex: context.childCount,
            errors,
          });
        } else {
          errors.hasAgreedToPhotos = !req.body.hasAgreedToPhotos;
          errors.hasAgreedToMedicalTreatment = !req.body.hasAgreedToMedicalTreatment;
          errors.hasAgreedToRegistration = !req.body.hasAgreedToRegistration;

          if(errors.hasAgreedToPhotos || errors.hasAgreedToMedicalTreatment || errors.hasAgreedToRegistration) {
            res.render("steps/summary", { context, errors });
            break;
          }

          try {
            const dataChildren = await Promise.all(
              context.children
                .slice(1, +context.childCount + 1)
                .map((child) => Child.create(child))
            );

            const parent = await Parent.create(context.parent);

            await parent.addChildren(dataChildren);
          } catch (e) {
            res.render("steps/error");
            break;
          }

          res.render("steps/success");
        }

        break;
    }
  }
);

module.exports = router;
