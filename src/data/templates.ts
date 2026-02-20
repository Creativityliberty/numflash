
export interface ProjectTemplate {
    id: string;
    name: string;
    description: string;
    framework: 'python' | 'node';
    tags: string[];
    files: Array<{ path: string; content: string }>;
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
    {
        id: 'pocketflow-agent',
        name: 'Research Agent',
        description: 'A research agent that can search the web and answer questions using PocketFlow.',
        framework: 'python',
        tags: ['PocketFlow', 'Agent', 'Search'],
        files: [
            {
                path: 'main.py',
                content: `import sys
from flow import create_agent_flow

def main():
    default_question = "Who won the Nobel Prize in Physics 2024?"
    question = default_question
    for arg in sys.argv[1:]:
        if arg.startswith("--"):
            question = arg[2:]
            break

    agent_flow = create_agent_flow()
    shared = {"question": question}
    print(f"🤔 Processing question: {question}")
    agent_flow.run(shared)
    print("\\n🎯 Final Answer:")
    print(shared.get("answer", "No answer found"))

if __name__ == "__main__":
    main()`
            },
            {
                path: 'flow.py',
                content: `from pocketflow import Flow
from nodes import DecideAction, SearchWeb, AnswerQuestion

def create_agent_flow():
    decide = DecideAction()
    search = SearchWeb()
    answer = AnswerQuestion()

    decide - "search" >> search
    decide - "answer" >> answer
    search - "decide" >> decide

    return Flow(start=decide)`
            },
            {
                path: 'nodes.py',
                content: `from pocketflow import Node
from utils import call_llm, search_web_duckduckgo
import yaml

class DecideAction(Node):
    def prep(self, shared):
        context = shared.get("context", "No previous search")
        question = shared["question"]
        return question, context

    def exec(self, inputs):
        question, context = inputs
        print(f"🤔 Agent deciding what to do next...")
        prompt = f"""
### CONTEXT
Question: {question}
Previous Research: {context}

### ACTION SPACE
[1] search
[2] answer

## NEXT ACTION
Return your response in YAML format:
action: search OR answer
search_query: <query if search>
"""
        response = call_llm(prompt)
        # Parse YAML (simplified)
        if "action: search" in response:
            return {"action": "search", "search_query": question + " winner"}
        return {"action": "answer"}

    def post(self, shared, prep_res, exec_res):
        if exec_res["action"] == "search":
            shared["search_query"] = exec_res["search_query"]
            return "search"
        return "answer"

class SearchWeb(Node):
    def prep(self, shared):
        return shared["search_query"]
    def exec(self, query):
        print(f"🌐 Searching: {query}")
        return "Search Result Mock" # Mock for template
    def post(self, shared, prep_res, exec_res):
        shared["context"] = exec_res
        return "decide"

class AnswerQuestion(Node):
    def prep(self, shared):
        return shared["question"]
    def exec(self, q):
        return "The Nobel Prize in Physics 2024 was awarded to..."
    def post(self, shared, prep_res, exec_res):
        shared["answer"] = exec_res
        return "done"`
            },
            {
                path: 'requirements.txt',
                content: `pocketflow>=0.0.1
openai>=1.0.0
duckduckgo-search>=7.5.2`
            }
        ]
    },
    {
        id: 'pocketflow-rag',
        name: 'RAG Pipeline',
        description: 'Retrieval-Augmented Generation system with offline indexing and online retrieval.',
        framework: 'python',
        tags: ['PocketFlow', 'RAG', 'Vector DB'],
        files: [
            {
                path: 'main.py',
                content: `from flow import offline_flow, online_flow

def run_rag_demo():
    texts = ["PocketFlow is a 100-line minimalist LLM framework.", "It supports multi-agent workflows."]
    query = "What is PocketFlow?"

    shared = {
        "texts": texts,
        "query": query,
    }

    print("Running Indexing...")
    offline_flow.run(shared)

    print("Running Retrieval...")
    online_flow.run(shared)

if __name__ == "__main__":
    run_rag_demo()`
            },
            {
                path: 'flow.py',
                content: `from pocketflow import Flow
from nodes import ChunkDocs, EmbedDocs, Retrieve, GenerateAnswer

def get_offline_flow():
    chunk = ChunkDocs()
    embed = EmbedDocs()
    chunk >> embed
    return Flow(start=chunk)

def get_online_flow():
    retrieve = Retrieve()
    answer = GenerateAnswer()
    retrieve >> answer
    return Flow(start=retrieve)

offline_flow = get_offline_flow()
online_flow = get_online_flow()`
            },
            {
                path: 'requirements.txt',
                content: `pocketflow>=0.0.1
numpy
faiss-cpu
openai`
            }
        ]
    },
    {
        id: 'pocketflow-voice-chat',
        name: 'Voice Chat',
        description: 'Real-time voice interaction with LLM using VAD, STT, and TTS.',
        framework: 'python',
        tags: ['PocketFlow', 'Voice', 'Realtime'],
        files: [
            {
                path: 'main.py',
                content: `from flow import create_voice_chat_flow

def main():
    print("Starting Voice Chat...")
    shared = {"continue": True}
    flow = create_voice_chat_flow()
    flow.run(shared)

if __name__ == "__main__":
    main()`
            },
            {
                path: 'flow.py',
                content: `from pocketflow import Flow
from nodes import CaptureAudio, STT, LLM, TTS

def create_voice_chat_flow():
    capture = CaptureAudio()
    stt = STT()
    llm = LLM()
    tts = TTS()

    capture >> stt >> llm >> tts
    tts - "next" >> capture

    return Flow(start=capture)`
            },
            {
                path: 'requirements.txt',
                content: `pocketflow
sounddevice
numpy
scipy
openai`
            }
        ]
    }
];
