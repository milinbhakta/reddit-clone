import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

export type IContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
};
