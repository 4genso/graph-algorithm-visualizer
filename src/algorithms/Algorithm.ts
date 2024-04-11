import { GraphState } from "../types/GraphState.type.ts";

export abstract class Algorithm {
  protected abstract done: boolean;

  public abstract nextStep(): GraphState;

  public get isFinished(): boolean {
    return this.done;
  }
}
