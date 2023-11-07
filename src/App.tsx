import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Matter, { Body, Engine, Render, Runner } from "matter-js";

function App() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    var Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

      // create an engine
      var engine = Engine.create({
        gravity: {x: 0, y:0},
  positionIterations: 10, // Increase the number of position iterations
  velocityIterations: 8,  // Increase the number of velocity iterations
});
       var engine = Engine.create({gravity: {x: 0, y: 0}});
      Matter.Events.on(engine, "collisionStart", (event) => {
        event.pairs.forEach((pair) => {
          const bodyA = pair.bodyA;
          const bodyB = pair.bodyB;
          // console.log("Collision between:", bodyA, bodyB);
          // console.log("Ball velocity:", ball.velocity);


        });
      });

    // create a renderer
    var render = Render.create({
      element: ref.current || document.body,
      engine: engine,
      options:{
        background: '#ffffff',
        width: 600,
        height: 800,
        wireframes: false,
      }
    });
  
    // create two boxes and a ground
    var bottom = Bodies.rectangle(300, 800, 600, 10, { isStatic: true });
    var top = Bodies.rectangle(300, 0, 600, 10, {isStatic: true});
    var right = Bodies.rectangle(600, 400, 10, 800, {isStatic: true})
    var left = Bodies.rectangle(0, 400, 10, 800, {isStatic: true})
    var p1 = Bodies.rectangle(300, 770, 120, 20, { isStatic: true,
      chamfer: { radius: 10 }, });
    var p2 = Bodies.rectangle(300, 30, 120, 20, { isStatic: true, 
      chamfer: { radius: 10 },
    render: {
      fillStyle: "purple",
    } });
    var ball = Bodies.circle(300, 400, 10, {
      frictionAir: 0,
      friction: 0,
      force: {x: 1, y: 3},
      inertia: Infinity,
      density: 0.5,
      restitution: 1
    });

    // add all of the bodies to the world
    Composite.add(engine.world, [p1, p2, ball, bottom, top, right, left]);
    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    // run the engine
    // while(1)
    Runner.run(runner, engine);
    // Body.setPosition(p2, { x: ball.position.x, y: 10 });
    document.addEventListener("mousemove", (event) => {
      const mouseX = event.clientX;
      
      if (render.options && render.options.width) {
        const paddleWidth = 120;
        const paddleX = Math.min(
          Math.max(mouseX - paddleWidth / 2, paddleWidth / 2),
          render.options.width - paddleWidth / 2
          );
          
          // Update paddle position
          Body.setPosition(p1, { x: paddleX, y: p1.position.y });
        }
      });
      
    Matter.Events.on(engine, "beforeUpdate", () =>{
        Body.setPosition(p2, { x: ball.position.x, y: p2.position.y });
    })
    
    Matter.Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
    
        // Check if the collision involves the ball
        if (bodyA === ball || bodyB === ball) {
          const collisionAngle = Math.atan2(ball.velocity.y, ball.velocity.x);
          const collisionAngleDegrees = (collisionAngle * 180) / Math.PI;
    
          // Log the original collision angle in degrees
          console.log("Original Collision Angle (Degrees):", collisionAngleDegrees);
    
          // Check if the angle is less than 60 degrees
          if (collisionAngleDegrees < 60) {
            // Increase the angle, for example, by 20 degrees
            const newAngleDegrees = collisionAngleDegrees + 20;
    
            // Convert the new angle back to radians
            const newAngle = (newAngleDegrees * Math.PI) / 180;
    
            // Calculate a new velocity vector with the adjusted angle
            const newVelocity = {
              x: Math.cos(newAngle) * Matter.Vector.magnitude(ball.velocity),
              y: Math.sin(newAngle) * Matter.Vector.magnitude(ball.velocity),
            };
    
            // Set the new velocity for the ball
            Body.setVelocity(ball, newVelocity);
    
            // Log the new collision angle in degrees
            console.log("New Collision Angle (Degrees):", newAngleDegrees);
          }
        }
      });
    });
    
    return () =>{
      render.canvas.remove();
    }
  }, []);
  return<div>
    <div ref={ref}></div>
  </div>;
}

export default App;
