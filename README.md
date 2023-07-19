# Prima



## Information

<ul><li>Title: Jetpackbear</li><li>Creator: Jana Ivonne Franke</li><li>Semester: 5th; Summer 2023</li><li>Curriculum: Prototyping of interactive media apps and games</li><li>Professor: Prof. Jirka Dell´Oro-Friedl</li></ul>


## Checklist for the final assignment
© Prof. Dipl.-Ing. Jirka R. Dell'Oro-Friedl, HFU
| Nr | Criterion           | Explanation                                                                                                                                     |
|---:|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
|  1 | Units and Positions | the coordinate system starts fro the lower left of the character. The character itself is one unit tall and 0.6 units wide. The rest of the nodes oriantate themselfs by this position.                                                               |
|  2 | Hierarchy           | The setup has 3 main components:<ol><li>The character. Its the character itself with the rigidbody and all functions. Its children are only for visualisation, that the character can have different looks. </li> <li>Hitables: here is everything defined, that the character can collide with within the room. The obstacles and the enemy. The enemy is set up like the character.</li><li>The Background. Its the room itself, the pictures and the walls</li> </ol>                                                                           |
|  3 | Editor              | I used the editor for creating materials an the basic structures in the internal and graph, so that I can generate the world itself per code.                                                               |
|  4 | Scriptcomponents    | I used a Componentscript called collider.ts which helps me steer the Enemy without using to much Code. If I wanted to spawn more enemies, this would safe me time.                                                           |
|  5 | Extend              | I used a lot of classes extending the Fudge-Node to create the components for the world, the room.                       |
|  6 | Sound               | Use sounds and explain your choice of sounds and placement in respect to the user's perception.                                                 |
|  7 | VUI                 | My virtual user interface consists of a health bar and a score board.                                            |
|  8 | Event-System        | I used costumEvents for a collision between the enemy and the character for exapmple. It helps within the statemachine, triggering a new state. |
|  9 | External Data       | I created a configfile, for the amount of hearts, the speed of the Character and manly for the world building itself, to controll its size quickly.                              |
|  A | Light               | I used an ambient light that is a child of the character node, because i wanted fr it to change to a point ligth in further processes. In the moment it changes colour to create an ambiance.                                                                     |
|  B | Physics             | The character, enemy, obstacle and walls have a rigidbody, every type is used, exmpl. Character has dynamic, walls static, collision is possible to block the path of the character. The character and enemy move with a force. Obstacles work with joints.                                       |
|  C | Net                 | o.o                                                                                            |
|  D | State Machines      | I created a Component for the statemachine, allowing the enemy to switch between to states.                                    |
|  E | Animation           | The character and enemy have an AnimationSprite and an obstacle an Animation in Fudge.                                              |




## Concept
A Jetpack game, similar to flappy bird and Jetpack Joyride. The player has 3 lifes and an enemy who tries to constantly hit the player. The player has to navigate around obstacles, trying to miss the enemy while doing so. The score shows the user how far they came, before dying.

Link to concept design: <[Design-pdf](https://github.com/CleoKaty/Jetpackbear/blob/8105b24642cfc16725379ec9ed31d3977fc68bd7/jetpackbearConceptdesign.pdf) 

## Links

[Link to Code](https://github.com/CleoKaty/Jetpackbear)   
[Link to the game itself](https://cleokaty.github.io/Jetpackbear/)

