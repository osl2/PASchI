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
    getRoom(id: string): Interaction | undefined {
      this.interactions.forEach((element) => {
        if (element.getId === id) {
          return element;
        }
      });
      return undefined;
    },
    getAllRooms(): Interaction[] {
      // @ts-ignore
      return this.interactions;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
