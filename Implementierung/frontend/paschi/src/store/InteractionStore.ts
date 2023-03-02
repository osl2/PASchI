import {defineStore} from "pinia";
import {Interaction} from "@/model/userdata/interactions/Interaction";

export const useInteractionStore = defineStore('interactions', {
  state: () => ({
    interactions: [] as Interaction[],
    nextId: 0
  }),
  actions: {
    addInteraction(interaction: Interaction) {
      this.interactions.push(interaction);
    },
    deleteInteraction(id: string) {
      this.interactions.forEach((element, index) => {
        if (element.getId === id) {
          this.interactions.splice(index, 1);
        }
      });
    },
    getInteraction(id: string): Interaction | undefined {
      let interaction: Interaction;
      this.interactions.forEach((element) => {
        if (element.getId === id) {
          // @ts-ignore
          interaction = element;
        }
      });
      // @ts-ignore
      if (interaction !== undefined) {
        return interaction;
      }
      return undefined;
    },
    getInteractionByTimeStamp(time: string): Interaction | undefined {
      for (const interaction of this.interactions) {
        if (interaction.timeStamp === time) {
          return <Interaction> interaction;
        }
      }
      return undefined;
    },
    getAllInteractions(): Interaction[] {
      // @ts-ignore
      return this.interactions;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
