
---
title: "Understanding how CPU works (part 3)"
date: "2025-04-27"
excerpt: "Learning about CPU"
---

*Understanding how CPU works (part3)*

Huhh, i have finally finished this long video. I think i have spend like 5ish hours to watch and write post about it. The video itself is 3:20 hr long, BUTTT it worth the time i spent, and i have an understanding on CPUs. This post will be covering from almost hour 2nd till the end.

## Speculative execution - branch prediction
Casey started explaining about branch prediction, well what is that and where it happens. There was a specific block for branch prediction in the AMD chart Casey was showing. If you remember the instructions has to be turned into microps in the decoder and they will be stored in the queue. Interestingly the code will be turned into microps and will be in the queue even before register records necessary parameters. Imagine there is a function takes two arguments and adds. The add microp will be in the queue before you put the arguments. Now imagine you have too many conditionals, and these if condition may not be executed based on the parameter you put. But all the instructions within the conditional will be also decoded and will be waiting in the queue. So the branch prediction happens here. It tries to predict whether the conditional happens or not. Based on the prediction the conditional code instruction will be decoded to microps or not. That's what i understood, correct me if i am wrong.

## video encoding hardware on CPU
Apple M series is NOT a CPU , it is an APU (CPU and GPU has both in the chip). Well, there were more stuff, but it was on some history and current state and some technical stuff that i didn't understand.

## QnA
The QnA with Community has started. They were discussing why Intel and AMD chips were having some bugs and their history. But i really liked the topics they discussed regarding how the big chip companies trying to change and how politics/leadership in those companies are changing the status quo. 

What are the bottleneck for the processors, like what is slowing down the chips development - programs and programmers. Like in the code there are a lot of dependencies and a lot of parallel processing. You might ask why CPUs are not doing the jobs faster enough, because it depends on the way we program.

There was a great point during the conversation - computers are way faster than you think, it is just you who doesn't know how to use it properly.

Quantum computing was a small topic during QnA, Casey doesn't have any idea about it. But, whatever people are doing with quantum computing is breaking the cryptography - i don't think anyone is found of. And we don't know what actually we can do with quantum computing and quantum softwares. We should be switching to the post-quantum cryptography, which is quite expensive now.

---

That was all for the video. I really liked it, i know i didn't get all the informationa dn discussed topics, but i have more stuff before i watch the video. I don't regret spending time on it. I highly recommend to watch the video:

the video: https://youtu.be/jC_z1vL1OCI?si=F4ZAZN2MxC7dL5_Q