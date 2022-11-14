import { IDataloaders } from "src/dataloader/dataloader.interface";

declare global {
    interface IGraphQLContext {
        loaders: IDataloaders;
    }
}