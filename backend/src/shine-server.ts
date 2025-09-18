import express, { Request, Response } from "express";
import cors from "cors";
import { COMPONENT_DATA_TEMPLATES, ComponentData } from "../../ts-shared/types";
import { ShineDB } from "./shine-db";

const PORT = 3000;

export class ShineServer {
  constructor(shineDB: ShineDB) {
    const app = express();

    app.use(cors());

    app.use(express.json());

    app.get("/api/test", (_req: Request, res: Response) => {
      res.json({ message: "hello world" });
    });

    app.get("/api/get-component-data", (req: Request, res: Response) => {
      // const componentKey = req.headers["componentkey"];
      // const componentKey = req.query.componentkey as string | undefined;

      // console.log(componentKey);
      // if (componentKey === undefined) {
      //   res.json(shineDB.getAllData());
      //   return;
      // }

      // const componentData = shineDB.getComponentData(
      //   componentKey as keyof ComponentData
      // );

      // if (componentData === undefined) {
      //   res.status(400).send("Invalid component ID provided");
      //   return;
      // }

      // res.status(200).json(componentData);

      res.status(200).json({ cool: 0, warm: 10 });
    });

    app.post("/api/set-component-data", (req: Request, res: Response) => {
      try {
        shineDB.setComponentData(req.body as Partial<ComponentData>);
        console.log(req.body);
        res.status(200).send("Updated component data");
      } catch (e) {
        res.status(400).send("Invalid component data provided");
      }
    });

    app.post("/api/apply-template", (req: Request, res: Response) => {
      const templateName = req.headers["template-name"];

      if (templateName === undefined || typeof templateName !== "string") {
        res.status(400).send("No template-name header provided");
        return;
      }

      const template = COMPONENT_DATA_TEMPLATES[templateName];

      if (template === undefined) {
        res.status(400).send("Invalid template-name provided");
        return;
      }

      shineDB.setComponentData(template());

      res.status(200).send("Template applied");
    });

    app.listen(PORT, () => {
      console.log(`Frontend on http://localhost:${PORT}`);
    });
  }
}
