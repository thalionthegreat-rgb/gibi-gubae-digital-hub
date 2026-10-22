// Gibi Gubae AI backend for Cloudflare Workers + Workers AI.
// In Cloudflare Dashboard, create a Worker and enable the AI binding named AI.
// Set SITE_ORIGIN to exactly: https://thalionthegreat-rgb.github.io
// This is a starter for testing, not a complete production security system.
const MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8";
const ALLOWED_ORIGIN = "https://thalionthegreat-rgb.github.io";
const MAX_PROMPT_CHARS = 4000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 12;
const hits = new Map(); // best-effort in-memory throttling; not global or durable.

const SYSTEM = {
  orthodox: "You are an educational assistant for an Ethiopian Orthodox Tewahedo university fellowship. Answer respectfully in the user's requested language, Amharic or English. Explain general Bible and Orthodox learning topics, but do not claim to be a priest or replace confession, pastoral counsel, or sacramental guidance. Never invent Bible quotations or claim an uncertain reference is verified. Clearly label suggested references that need checking. Encourage students to ask their priest for personal spiritual matters.",
  quiz: "You create Bible study quizzes for an Ethiopian Orthodox Tewahedo university fellowship. Reply in the requested language. Make clear which questions and Bible references are suggestions that must be checked against the fellowship's chosen Bible edition. Do not fabricate exact quotations. Include questions, answer key, explanations, and a suggested Bible reference when possible. Use a mix of multiple-choice and short-answer questions unless the user specifies otherwise.",
  lesson: "You are a lesson-planning assistant for an educated Ethiopian Orthodox Tewahedo university fellowship. Reply in the requested language. Create a structured lesson with aim, opening, relevant Scripture references, key points, discussion questions with suggested answers, practical activity, conclusion, and follow-up. Do not fabricate quotations. Recommend priest review for doctrinal or sacramental claims.",
  engagement: "You are a fellowship activity-planning assistant. Use only anonymous aggregate statistics provided by the user. Suggest respectful, practical ways to improve participation. Never rank or judge individual students, infer spiritual condition, confession, sin, or Communion participation. Do not ask for personal student data. Reply in the requested language."
};
function json(data, status, origin) {
  return new Response(JSON.stringify(data), {status, headers:{"content-type":"application/json; charset=utf-8", "access-control-allow-origin":origin || ALLOWED_ORIGIN, "access-control-allow-methods":"POST, OPTIONS", "access-control-allow-headers":"Content-Type", "vary":"Origin", "cache-control":"no-store"}});
}
export default {
 async fetch(request, env) {
  const origin=request.headers.get("Origin") || "";
  if (request.method === "OPTIONS") {
    if (origin !== ALLOWED_ORIGIN) return new Response(null,{status:403});
    return new Response(null,{status:204,headers:{"access-control-allow-origin":ALLOWED_ORIGIN,"access-control-allow-methods":"POST, OPTIONS","access-control-allow-headers":"Content-Type","access-control-max-age":"86400","vary":"Origin"}});
  }
  if (origin !== ALLOWED_ORIGIN) return json({error:"Origin not allowed."},403,ALLOWED_ORIGIN);
  if (request.method !== "POST") return json({error:"Use POST."},405,ALLOWED_ORIGIN);
  const ip=request.headers.get("CF-Connecting-IP") || "unknown";
  const now=Date.now(); const old=(hits.get(ip)||[]).filter(t=>now-t<WINDOW_MS);
  if(old.length>=MAX_PER_WINDOW) return json({error:"Rate limit reached. Please wait a few minutes."},429,ALLOWED_ORIGIN);
  old.push(now); hits.set(ip,old);
  let body; try { body=await request.json(); } catch { return json({error:"Invalid JSON."},400,ALLOWED_ORIGIN); }
  const mode=String(body.mode||"orthodox"); const prompt=String(body.prompt||"").trim(); const language=String(body.language||"Amharic");
  if(!SYSTEM[mode]) return json({error:"Unknown AI feature."},400,ALLOWED_ORIGIN);
  if(!prompt || prompt.length>MAX_PROMPT_CHARS) return json({error:"Question is empty or too long (maximum 4,000 characters)."},400,ALLOWED_ORIGIN);
  const messages=[
   {role:"system",content:SYSTEM[mode]+" Answer in "+language+". Do not request or process personal student data, Fayda IDs, private confession details, sins, Communion participation, or private conversations with clergy."},
   {role:"user",content:prompt}
  ];
  try {
   const result=await env.AI.run(MODEL,{messages,max_tokens:900,temperature:0.4});
   const answer=(result && (result.response || result.output_text || result.text)) || "No response was returned by the model.";
   return json({response:String(answer),model:MODEL},200,ALLOWED_ORIGIN);
  } catch(err) {
   return json({error:"AI request failed. Check that Workers AI is enabled and the AI binding is named AI."},502,ALLOWED_ORIGIN);
  }
 }
};
