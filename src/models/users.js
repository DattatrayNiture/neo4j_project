// const { nanoid } = require('nanoid');

const neo4j = require('neo4j-driver');
require('dotenv').config()
const {
    url,
    db_username,
    db_password,
    database,
} = process.env
const driver = neo4j.driver(url, neo4j.auth.basic(db_username, db_password));
const session = driver.session({ database });
function generateRandomUniqueNumber() {
    const generatedNumbers = new Set();
    const min = 10000000; // Minimum 8-digit number
    const max = 99999999; // Maximum 8-digit number

    while (true) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!generatedNumbers.has(randomNumber)) {
            generatedNumbers.add(randomNumber);
            return randomNumber;
        }
    }
}

// Example usage:
// const uniqueNumber = generateRandomUniqueNumber();
// console.log(uniqueNumber);

const findAll = async () => {
    const result = await session.run(`Match (u:User) return u`)
    return result.records.map(i => i.get('u').properties)
}

const findById = async (id) => {
    const result = await session.run(`MATCH (u:User {_id : '${id}'} ) return u limit 1`)
    return result.records[0].get('u').properties
}
const create = async (user) => {
    const unique_id = generateRandomUniqueNumber(); // nanoid(8)
    await session.run(`CREATE (u:User {_id : '${unique_id}', name: '${user.name}', email: '${user.email}', password: '${user.password}'} ) return u`)
    return await findById(unique_id)
}
const findByIdAndUpdate = async (id, user) => {
    const result = await session.run(`MATCH (u:User {_id : '${id}'}) SET u.name= '${user.name}', u.email= '${user.email}', u.password= '${user.password}' return u`)
    return result.records[0].get('u').properties
}
const findByIdAndDelete = async (id) => {
    await session.run(`MATCH (u:User {_id : '${id}'}) DELETE u`)
    return await findAll()
}

module.exports = {
    findAll,
    findById,
    create,
    findByIdAndUpdate,
    findByIdAndDelete
}
