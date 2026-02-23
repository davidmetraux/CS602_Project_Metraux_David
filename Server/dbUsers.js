//pull from cs602_project_customers later
const users = [
    {
        _id: "1",
        name:"Abby",
        username: "abby",
        password: "1234",
        role:"user",
        orders: ["1"]
    },
    {
        _id:"2",
        name: "Barry",
        username: "barry",        
        password: "2345",
        role:"user",
       orders: ["2"] 
    },
    {
        _id:"3",
        name: "Charlene",
        username: "charlene",        
        password: "3456",
        role:"admin",
        orders: ["3"] 
    }
]

export function findUser (username) {
  return users.find(user => 
            user.username == username);
}

export async function  validateUser(name, password) {
  return users.find(user => 
            user.username == name && user.password == password);
}
