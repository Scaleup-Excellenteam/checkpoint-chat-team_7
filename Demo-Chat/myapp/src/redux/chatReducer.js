const initialState = {
    beforeChat: []
};


const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SETBC': {
            return { ...state, beforeChat: action.payload }
        }

        default:
            return state
    }
}


export default chatReducer