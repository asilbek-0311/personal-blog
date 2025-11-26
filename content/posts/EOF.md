---
title: "EOF - EVM object format"
date: "2025-04-21"
excerpt: "A quick intro about EOF "
---

**Lets talk about EOF, and WTH it is.**

I have been seeing EOF and some discussion around it in twitter especially in the recent days nearing Pectra Upgrade. I did quite a reading and researching about it to understand, so you dont have to. I will share the links at the end if you would like to read on that.

Lets discuss what is EOF. EVM object format - is first introduced in 2021, London fork. Basically, smart contracts today have no format, the data they contain are called opcodes, which are step by step instructions (bytes) to the Ethereum Virtual Machine to execute. The proposal is to add a format to the contracts, which would include code sections, data sections, functions, and more. https://evmobjectformat.org/

Okay, now lets see why EOF was introduced in the first place.
1) Code and data separation. EOF splits executable code sections from non-executable data (e.g., constructor arguments), enabling static analysis tools and layer-2 clients to process code more efficiently and accurately.
2) Deploy-time validation: Contracts are validated **once** at creation, catching invalid instructions or malformed payloads (e.g., truncated `PUSH` data) before the code is ever executed. This offloads work from each transaction execution and enhances security guarantees.
3) Versioning. Adding a version to EVM, allowing future upgrades, makes it easier to create space for designing i guess.
4) Tooling and Auditing. Having a standard space for the code logic and the data makes it easier for formal verification and static analysis.

There are quite technical stuff, like introducing specific new opcodes to introduce relative jumping to lets say code or data, but it is coming with a bottleneck - it may not be compatible with older codes. They introduced nice prefix `0xEF` for the EOF contracts to make it different from the legacy code, thats why it has been being reserved since the London fork. 

BUT, there are a lot of discussion happing that EOF is making it harder and unnecessary. The discussions are saying it can be done even without EOF, and EOFs potential negative impacts. You can read more about it here: [link to the form](https://ethereum-magicians.org/t/ethereum-is-turning-into-a-labyrinth-of-unnecessary-complexity-with-eof-lets-reconsider-eof/23136/1)

In **March 2025 (ACD Call)**, Core devs reaffirm shipping **full EOF** with the Fusaka fork, despite acknowledged complexity concerns. From there on the main discussion has kicked off (i think).

In **April 28, 2025 (ACD Call)**, After extensive Interop Testing discussions, EOF is **removed** from Fusaka due to insufficient rough consensus and timeline risk. You can check out the call: [link to the call](https://www.youtube.com/watch?v=M3DWaWbIB3s&ab_channel=Ethereum)
 
 There was some confusion about Pectra upgrade as well. **Pectra Upgrade (May 7, 2025)** Unaffected by EOF debates; proceeds as scheduled. It doesnt include any EOF implementation.

Thats what i understood, i am keep watching how this is gonna turn out to be. i dont have enough information and long term seeing to decide on which side to be. Let me know if i am wrong on any of this ))