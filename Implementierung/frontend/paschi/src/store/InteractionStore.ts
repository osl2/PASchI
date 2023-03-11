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
      for (const interaction of this.interactions) {
        if (interaction.getId === id) {
          return <Interaction>interaction;
        }
      }
      return undefined;
    },
    getInteractionByTimeCreatedAndSession(time: string, sessionId: string): Interaction | undefined {
      for (const interaction of this.interactions) {
        if (interaction.session.getId === sessionId
          && interaction.createdAt.substring(0, 23) === time.substring(0, 23)) {
          return <Interaction>interaction;
        }
      }
      return undefined;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
