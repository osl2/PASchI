import {defineStore} from "pinia"

export const useUserStore = defineStore('user', {
    state: () => ({
      userID: 0,
      userName: 'igor@abc.info',
      firstName: 'Igor',
      surName: 'Schnecke'
    }),
    getters: {
      getUserID: (state) => {
        return state.userID
      },
      getUserName: (state) => {
        return state.userName
      },
      getFirstName: (state) => {
        return state.firstName
      },
      getSurName: (state) => {
        return state.surName
      }
    }
  })
