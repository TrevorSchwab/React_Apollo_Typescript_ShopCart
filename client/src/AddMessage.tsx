import React, { useState } from 'react';
// import { Mutation } from "react-apollo";
// import gql from "graphql-tag";
// import id from "short-id";

// const AddMessage = () => {

//   const [state, setState] = useState({
//     author: '',
//     title: '',
//     body: '',
//   });

//   console.log('state ', state);

//   const handleChange = e => {
//     e.preventDefault();
//     const { value, name } = e.target;
//     setState(prevState => { return {...prevState, [name]: value}});
//   };

//   const inputFields = Object.keys(state);

//   return (
//     <div>
//       {inputFields.map((field, index) => {
//         return field !== 'id' ?
//         <input
//           key={index}
//           placeholder={field}
//           name={field}
//           onChange={e => handleChange(e)}
//           value={state.field}
//         />
//       : null })}
// <Mutation
//   mutation={ADD_MESSAGE}
//   variables={state}
//   refetchQueries={() => [{ query: GET_MESSAGES }]}
// >
//   {addMessage => <button onClick={addMessage}>Add Message</button>}
// </Mutation>
//     </div>
//   );
// }

// export default AddMessage;

// const GET_MESSAGES = gql`
//   {
//     messages {
//       body
//     }
//   }
// `;

// const ADD_MESSAGE = gql`
//   mutation AddMessage($body: String!, $title: String!, $author: String!) {
//     addMessage(body: $body, title: $title, author: $author) {
//       author
//     }
//   }
// `;
