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
    var engine = Engine.create({gravity: {x: 0, y: 0}});

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
    var boxA = Bodies.rectangle(400, 200, 80, 80);
    var boxB = Bodies.rectangle(450, 50, 80, 80);
    var bottom = Bodies.rectangle(300, 800, 600, 10, { isStatic: true });
    var top = Bodies.rectangle(300, 0, 600, 10, {isStatic: true});
    var right = Bodies.rectangle(600, 400, 10, 800, {isStatic: true})
    var left = Bodies.rectangle(0, 400, 10, 800, {isStatic: true})
    var p1 = Bodies.rectangle(300, 800 - 50, 120, 20, { isStatic: true });
    var p2 = Bodies.rectangle(300, 50, 120, 20, { isStatic: true });
    var ball = Bodies.circle(300, 400, 10, {frictionAir: 0, friction: 0, force: {x: 1, y: 2}, inertia: Infinity, density: 0.5, restitution: 1});

    // add all of the bodies to the world
    Composite.add(engine.world, [p1, p2, ball, bottom, top, right, left]);
    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);
    return () =>{
      render.canvas.remove();
    }
  }, []);
  return <div ref={ref}></div>;
}

export default App;