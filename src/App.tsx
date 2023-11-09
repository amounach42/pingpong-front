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
      gravity: { x: 0, y: 0 },
      positionIterations: 10, // Increase the number of position iterations
      velocityIterations: 8,  // Increase the number of velocity iterations
    });
    var engine = Engine.create({ gravity: { x: 0, y: 0 } });
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
      options: {
        background: '#ffffff',
        width: 600,
        height: 800,
        wireframes: false,
      }
    });
    // --------------------------- create two boxes and a ground ---------------------------
    var bottom = Bodies.rectangle(300, 800, 600, 10, { isStatic: true });
    var top = Bodies.rectangle(300, 0, 600, 10, { isStatic: true });
    var right = Bodies.rectangle(600, 400, 10, 800, { isStatic: true })
    var left = Bodies.rectangle(0, 400, 10, 800, {
      isStatic: true,
    })
    var p1 = Bodies.rectangle(300, 770, 120, 20, {
      isStatic: true,
      chamfer: { radius: 10 },
    });
    var p2 = Bodies.rectangle(300, 15, 120, 20, {
      isStatic: true,
      chamfer: { radius: 10 },
      render: {
        fillStyle: "purple",
      }
    });
    var ball = Bodies.circle(300, 400, 10, {
      frictionAir: 0,
      friction: 0,
      force: { x: 1, y: 3 },
      inertia: Infinity,
      density: 0.5,
      restitution: 1,
      velocity: {
        x: 5,
        y: -5,
      }
    });

    
    Matter.Events.on(engine, "collisionStart", (event) => {
      console.log("velocity: ", ball.velocity);
    });

    Matter.Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        // Check if the collision involves the ball
        if (bodyA === ball || bodyB === ball) {
          const collisionNormal = pair.collision.normal;

          // Check if the angle is less than a threshold (in radians)
          const angleThreshold = 0.1; // Adjust this threshold as needed

          if (Math.abs(collisionNormal.x) < angleThreshold) {
            // Adjust the x-component of the velocity by a small increment
            const sign = ball.velocity.x > 0 ? 1 : -1; // Adjust the sign based on the current direction
            const adjustedVelocity = {
              x: ball.velocity.x + sign * 0.5, // Adjust this increment as needed
              y: ball.velocity.y,
            };

            // Set the adjusted velocity for the ball
            Body.setVelocity(ball, adjustedVelocity);
          }
        }
      });
    });
 //   ----------------------------------------------------------------------
// Initialize scores for Player 1 and Player 2
let scorePlayer1 = 0;
let scorePlayer2 = 0;

// Inside your update loop or event handling
Matter.Events.on(engine, "beforeUpdate", () => {
  // Check if the ball has crossed the first paddle (Player 1)
  if (
    ball.position.y < 5 &&
    ball.velocity.y < 0 // Ensure the ball is moving upwards
  ) {
    // Increment Player 2's score
    scorePlayer2++;

    // Log the updated scores (you can remove these lines if you don't want to log scores)
    console.log("BOT SCORE:", scorePlayer1);
    console.log("Player 2 Score:", scorePlayer2);

    // Reset the ball to the center
    Body.setPosition(ball, { x: 300, y: 400 });

    // Reset the ball's velocity if needed
    Body.setVelocity(ball, { x: 5, y: -5 });
  }

  // Check if the ball has crossed the second paddle (Player 2)
  if (
    ball.position.y > 770 &&
    ball.velocity.y > 0 // Ensure the ball is moving downwards
  ) {
    scorePlayer1++;

    // Log the updated scores (you can remove these lines if you don't want to log scores)
    console.log("BOT SCORE :", scorePlayer1);
    console.log("Player 2 Score:", scorePlayer2);

    // Reset the ball to the center
    Body.setPosition(ball, { x: 300, y: 400 });

    // Reset the ball's velocity if needed
    Body.setVelocity(ball, { x: 5, y: -5 }); // Adjust the initial velocity as needed
  }
});
    // ---------------------------------------------------------------------

    // Inside your update loop or event handling
    Matter.Events.on(engine, "beforeUpdate", () => {
      const maxX = 600; // Adjust these values based on your world size
      const maxY = 800;

      // Check if the ball is outside the bounds
      if (ball.position.x < 0 || ball.position.x > maxX || ball.position.y < 0 || ball.position.y > maxY) {
        // Reset the ball to the center
        Body.setPosition(ball, { x: 300, y: 400 });

        // Reset the ball's velocity if needed
        Body.setVelocity(ball, { x: 5, y: -5 }); // Adjust the initial velocity as needed
      }
    });

    // add all of the bodies to the world
    Composite.add(engine.world, [p1, p2, ball, bottom, top, right, left]);
    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);
    Body.setPosition(p2, { x: ball.position.x, y: 25 });
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



    Matter.Events.on(engine, "beforeUpdate", () => {
      Body.setPosition(p2, { x: ball.position.x, y: p2.position.y });
    })
    return () => {
      render.canvas.remove();
    }
  }, []);
  return <div>
    <div ref={ref}></div>
  </div>;
}

export default App;
