import OpenAI from "openai";
import readlineSync from "readline-sync";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY,
})


async function getWeatherDetails(city) {
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.current.temp_c; 
  } catch (error) {
    console.error("Error:", error);
  }
}


const SYSTEM_PROMPT = `You are an AI assistant with START, PLAN, ACTION, OBSERVATION and OUTPUT states.
Wait for the user prompt and first PLAN using available tools.
After planning, take the ACTION with appropriate tools and wait for the OBSERVATION based on the action.
Once you get the OBSERVATION, return the AI response based on the START prompt and observations.

strictly follow the JSON format in the example

Available Tools:
- function getWeatherDetails(city: string): string


Example:

START
{ "type": "user", "user": "What is the sum of weather of Patiala and Mohali?" }

{ "type": "plan", "plan": "I will call the getWeatherDetails for Patiala" }
{ "type": "action", "function": "getWeatherDetails", "input": "Patiala" }
{ "type": "observation", "observation": "10°C" }

{ "type": "plan", "plan": "I will call the getWeatherDetails for Mohali" }
{ "type": "action", "function": "getWeatherDetails", "input": "Mohali" }
{ "type": "observation", "observation": "14°C" }

{ "type": "output", "output": "The sum of weather of Patiala and Mohali is 24°C" }`;


//----------------------------------------------------------------------------------------------------------------------------------------------------------

// const prompt = "what is the temperature at kathmandu?"


// async function chatWithAI(){
//     const result = await client.chat.completions.create({
//             model: 'gpt-4o-mini',
//             messages : [
//                 { role: "system", content : SYSTEM_PROMPT},
//                 { role : 'developer', content: ` { "type": "plan", "plan": "I will call the getWeatherDetails for Kathmandu." }`},
//                 { role : 'developer', content: ` { "type": "action", "function": "getWeatherDetails", "input": "Kathmandu" } `},
//                 { role : 'developer', content: ` { "type": "observation", "observation": "15°C" }`},    // generates  dummy value as the actual call is not happening 
//                 { role:'user', content: prompt }],
//         })
//     console.log(result.choices[0].message.content);
// }

// chatWithAI();


//----------------------------------------------------------------------------------------------------------------------------------------------------------

const tools = {
    getWeatherDetails : getWeatherDetails,
}

const messages = [{ role: "system", content : SYSTEM_PROMPT }];

while (true){
  const query = readlineSync.question('>> ');
  const q = {
    type : 'user',
    user : query,
  }
  messages.push({ role : 'user', content: JSON.stringify(q)});

  while(true){
     const chat = await client.chat.completions.create({
       model: 'gpt-4o-mini',
       messages: messages,
       response_format: {type: 'json_object'},
     })
     
     const result = chat.choices[0].message.content;
     messages.push({role: 'assistant',  content:result});

     console.log(`\n\n-----------------START AI--------------`);
     console.log(result);
     console.log(`--------------End AI-------------------`);

     const call = JSON.parse(result);
     if(call.type == 'output'){
        console.log(`Assistent Response: ${call.output}`);
        break;
     }else if(call.type == 'action'){
       const fn = tools[call.function];
       const observation = await fn(call.input);
       const obs = { type : "observation", observation: observation};
       messages.push({ role: 'assistant', content: JSON.stringify(obs)});
     }
  }
}

