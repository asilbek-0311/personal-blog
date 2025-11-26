
---
title: "Understanding how CPU works (part 1)"
date: "2025-02-01"
excerpt: "Learning about CPU"
---

Understanding how CPU works (part 1)

I found this amazing video explaining how CPU works, and I am gonna write my understandings till [1:01:17](1:01:17), the video is around 3 hours long, probably i am gonna make 3 parts.

## Hardware companies are secretive 
One of the main discussion in the start regarding CPU, especially modern days CPUs are not having direct information about how they are made or how they are designed. Most of the CPU manufacturing companies like AMD and Intel, are very secretive about how they make their chips. Hence, it is very hard ot know for sure how they work. Only ways of knowing for sure is assuming how they work based on the performance and reverse engineering. That makes it hard for software devs to understand specifically how CPU works. Comparatively, if you wanna learn software development, most of the stuff is open-source, and people are willing to teach.

## CPU architecture basics
Two main words to take note is "micro-operations" and "instructions". And they are not the same thing. If you know, there are several instruction sets (IS) like x86 and ARM, which are, from my own understanding, set of commands that machine understands. It can be like `ADD`. Micro-operation is a tiny, atomic task of an instruction. Micro-op is the actual job that CPU does. For example:
Instruction can be `ADD [memory], AX` (add a value in memory to register AX).
But Micro-operation might be:
- Load: fetch the data from the memory
- Add: add it to AX
- Store: store the value
Okay, now, lets remember that, in the CPU architecture, there is a thing called ALU (Arithmetic Logic Unit) which was always regarded as magic box, where all the arithmetic operations happen. And in the modern CPUs there are multiple ALUs, and each ALU does set of things. For example, one ALU can do addition or multiplication, other can do storing and so. In the CPUs there will be around 20ish (in the example in the video there were the ones with 14/17) ALUs. And each ALU will have a specific micro-operation. Which means, there will be 20ish micro-operation all together. 

Knowing that IS has thousands of instructions, it doesnt corollate with the number of micro-operations. in the CPU there will be decoder, whose job is to get the instruction and turn into micro-operation. So, this is the big thing, CPU has limited micro-operations and they will use them to perform the tasks given by instruction. One line of instruction can be done in 2 or 3 or even more micro-operations.

## Performance and efficiency 
Design of the CPU effects the performance and efficiency. But, the type of the instruction set or the number of instructions in IS doesnt affect the performance of the CPU. What directly matters is - the decoder, how those instructions are decoded into micro-operations and which kind of ALUs they are directed to or used.

—-

Thats what i understood so far. This was still a new and big thing for me. The next post is gonna be about the types of instruction sets (x86, ARM, RISC-V), what they are, why they matter, and anything else they talk about in the video.