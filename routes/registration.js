var express = require("express");
const { Parent, Child } = require("../models");
const reduceValidationErrors = require("../utils/reduceValidationErrors");
const sendMail = require("../utils/sendMail");
var router = express.Router();

const MAX_CHILD_COUNT = 5;

router.get("/", (req, res, next) => {
  res.render("registration", {
    title: "Anmeldung",
    context: { parent: {}, children: [{}, {}, {}, {}, {}, {}], childCount: 0 },
    errors: {},
  });
});

router.post("/:stepType/:index?/:action", async (req, res, next) => {
  let context = req.body.context ? JSON.parse(req.body.context) : {};
  let errors = {};

  switch (req.params.stepType) {
    case "parent":
      const parent = Parent.build(req.body);

      context = {
        ...context,
        parent: parent.toJSON(),
        childCount: +req.body.childCount,
      };

      if (req.params.action === "next") {
        if (context.childCount < 1 || context.childCount > MAX_CHILD_COUNT) {
          errors.childCount =
            "Bitte wählen Sie aus, wie viele Kinder Sie anmelden möchten.";
        }

        try {
          await parent.validate();
        } catch (e) {
          errors = { ...errors, ...reduceValidationErrors(e.errors) };
        }

        if (Object.keys(errors).length) {
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
          errors = reduceValidationErrors(e.errors);

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
      const agreements = [
        "Photos",
        "MedicalTreatment",
        "PrivacyPolicy",
        "Registration",
      ];

      context = {
        ...context,
        ...agreements.reduce(
          (acc, curr) => ({
            ...acc,
            ["hasAgreedTo" + curr]: !!req.body["hasAgreedTo" + curr],
          }),
          {},
        ),
      };

      if (req.params.action === "prev") {
        res.render("steps/child", {
          context,
          childIndex: context.childCount,
          errors,
        });
      } else {
        errors = agreements.reduce(
          (acc, curr) =>
            req.body["hasAgreedTo" + curr]
              ? acc
              : {
                  ...acc,
                  ["hasAgreedTo" + curr]: true,
                },
          {},
        );

        if (Object.keys(errors).length) {
          res.render("steps/summary", { context, errors });
          break;
        }

        try {
          const children = await Promise.all(
            context.children
              .slice(1, +context.childCount + 1)
              .map((child) => Child.create(child)),
          );

          const parent = await Parent.create(context.parent);

          await parent.addChildren(children);
        } catch (e) {
          res.render("steps/error");
          break;
        }

        sendMail(
          context.parent,
          context.children.slice(1, +context.childCount + 1),
        );

        res.render("steps/success");
        break;
      }

      break;
  }
});

module.exports = router;
