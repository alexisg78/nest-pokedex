


export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3002,
  defaultLimit: process.env.DEFAULT_LIMIT || 7
})


// retornar la funcion anterior es lo mismo que hacerlo con el return:

// export const EnvConfiguration = () => {
//   return {

//   }
// }