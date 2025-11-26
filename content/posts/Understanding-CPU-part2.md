
---
title: "Understanding how CPU works (part 2)"
date: "2025-04-26"
excerpt: "Learning about CPU"
---

I have written a part 1 post ( you cna check it out in the Articles page), initially introducing that i found a nice wide and doing a review for the first hour. The video is quite long, i had watched it before, but to make the post i had ot watch it again, and i will be coving until [1:59:53](https://youtu.be/jC_z1vL1OCI?t=7193).  Last time we learned about the basics of chip architecture and how it works. In the part 2 it is gonna continue:

## Divide instruction
The initial discussion started with saying ARM and RISC-V doesn't have devide instruction. But Casey was showing in the [compiler explorer](https://godbolt.org/) and telling that in todays modern CPUs whatever it is (like x86, ARM, RISC-V) there is a native divide instruction. 

## ARM - low power, x86 was not meant for low power
Interestingly ARM was also open, noone was licensing. Quite interesting stuff is Intel and AMD is only one competing for x86 and specifically for  data centers, but now they are also going for low power stuff. Apple is doing good in terms of ARM with their M series. 

## RISC vs CISC is over exaggerated 
RISC and CISC is also not clearly defined, and it doesn't really make that much difference. Even modern Risc-V is looking quite complicated, the word "reduced" and "complexity" becoming quite relative here. But at the end classifying into RISC and CISC is not necessary, because at the end all ISA are trying to do the same thing: figuring out what sets of instruction compactly encodes what programmers are trying to do in a way that then chip can execute quickly.

## ISA differences
If we remember how the whole CPU structure is, the instructions will be turned into microps by decoders and this microps will be sent to the ALUs to be executed. in the ARM chips all instructions are fixed size so having multiple decoder can make it faster cuz it cna be distributed easily and decoded in every cycle, and move to the next. However x86 instructions are in different size, and decoder doesn't know where is the next instruction gonna start. How they work is usually based on guessing game, predicting where the next instruction might start. In this sence they may not be able to deliver as much microps as possible. Of course they are all based on the community charts, they may not be true (cuz the chip companies never share about it). 

## Flags
They talked about flags, but i didnt understand much about it. 

## Future stuff
They were talking about AMD and Intel is coming to some kind of consortium for x86_64 to make it better. It is quite a legacy ISA and these two key players coming up with consortium makes it easier for the kernel developers as well. 

---

I have noted down in a simpler way, but if you are interested and would like to see the charts  and learn better, just watch the whole dam video. I hope i will make the part 3, if i make one, it should cover about branch prediction (sounds cools right), video encoding on CPU and some community qna

the full video: https://youtu.be/jC_z1vL1OCI