---
title: "Model Context Protocol - MCP"
date: "2025-05-06"
excerpt: "Brief explaination on MCP "
coverImage: "/images/mcp_image.svg"
---

Model Context Protocol - MCP

Okay folks, lets talk about how LLMs or ai agents and real life data talk to each other aka MCP. Time to add another abbreviation to our protocol dictionary.

I am sure you have heard about it by now, but if you havent i am gonna simply explain it. (Even if you have, just read and get a different point of view )
Well basically, MCP is a standard protocol for ai agents to talk to each other. Traditionally, ai agents or LLM doesnt have any access to the real life data, and it is constrained with the pre-trained data. In order to access web or other services, we need to build a special connection to that service. And late 2024, Antrophic announced MCP to make this process easy. 
You can think of like an API but for AI agents. It uses client/server model, so we will have MCP clients - which is an LLM that you ask anything, and MCP server(s) - where you will have your ai agent that is connected to the database, or internet or other special services you have. That is a general look.
Lets dive a little bit deeper.
There are main components in the MCP server and MCP client. On the server there are three main concepts:
1) Tools - well technically a function, that can be called or used by the LLMs, so your client or user will get access to those database.
2) Recources - the data, it can be api response or files.
3) Prompt - pre-written template for the user to have good prompts.

Client side also had some concepts but i didnt really understand, and didnt see it in the docs, so i guess we can get along with it without understanding much, because we are all vibe coders at the end.

To utilise MCP clients, we need hosts. Since Antrophic introduced the protocol, Cloude Desktop is a host, and several IDEs, for example VScode is also coming MCP client capabilities now. I did a review on VScode agent mode introduction, and there there was an explaination on connecting to existing MCP servers. Check it out. 

I will be creating MCP servers and clients with several tools to better understand, since all the philosophers said "Learning is by doing". But until then, gonna be procrastinating and watching the explanation videos.

Resources (if you would like to be going deeper):
https://youtu.be/7j1t3UZA1TY
https://youtu.be/_d0duu3dED4
https://www.anthropic.com/news/model-context-protocol
https://modelcontextprotocol.io/docs/concepts/architecture
