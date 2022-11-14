/* 
Tower Stack
Main game file - in progress

@Author: Emily, Natalie, Aron
Created: 10/12/22
Updated: 11/13/22
*/

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import '../../App.css';
import {morseToChar} from "./charMorseConv";
import useSound from 'use-sound';
import dashSound from '../Assets/Sounds/dash.mp3'
import dotSound from '../Assets/Sounds/dot.mp3'
import {animated, useSpring} from 'react-spring';
import {initial, Buttons, ButtonsWithoutInput, resetInputTime, resetInputLength, BackButton} from "./Common/Functions";
import spacebar from "../Assets/Images/spacebar.png";
import enterButton from "../Assets/Images/enterButton.png";
import {Container} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {Transition} from "react-spring/renderprops";
import Card from "@material-ui/core/Card";
import {useHistory} from "react-router-dom";
import {Link} from "react-router-dom";

var textIndex = 0;

//tower.push(x) to add to the tower
var tower = [];

function updateTutorial() {
    var space = document.getElementById('spaceImage');
    var enter = document.getElementById('enterImage');

    if (textIndex === 0) {
        document.getElementById('tutorialText').innerHTML = 'This game consists of two buttons at the bottom of the page.';

        textIndex++;
    } else if (textIndex === 1) {
        document.getElementById('tutorialText').innerHTML = 'This button is used for the dots and can be accessed through the space button or by clicking here!';
        document.getElementById('dotButton').style.backgroundColor = "yellow";
        space.style.display = "block";
        textIndex++;
    } else if (textIndex === 2) {
        document.getElementById('dotButton').style.backgroundColor = document.getElementById('dashButton').style.backgroundColor;
        document.getElementById('tutorialText').innerHTML = 'This button is used for the dashes and can be accessed through the enter button or by clicking here!';
        document.getElementById('dashButton').style.backgroundColor = "yellow";
        space.style.display = "none";
        enter.style.display = "block";
        textIndex++;
    } else if (textIndex === 3) {
        document.getElementById('dashButton').style.backgroundColor = document.getElementById('dotButton').style.backgroundColor;
        document.getElementById('tutorialText').innerHTML = 'Enter any Morse code and see what letter or number it is!';
        //document.getElementById('sampleMorse').style.backgroundColor = "yellow";
        enter.style.display = "none";
        textIndex = 0;
    }
}
var t;


const towerStack = forwardRef((props, ref) => {
    const history = useHistory();
    function backToGames() {
        history.push("/GamesThemes");
    }
    var [input, setInput] = React.useState('');
    var output = morseToChar(input);
    const [volume, setVolume] = useState(() => initial('volume'));
    const [size, setSize] = useState(() => initial('size'));
    const [speed, setSpeed] = useState(() => initial('speed'));
    const [backgroundColor, setBackgroundColor] = useState(() => initial('backgroundColor'));
    const [buttonColor, setButtonColor] = useState(() => initial('buttonColor'));
    const [dashButtonColor, setDashButtonColor] = useState(() => initial('dashButtonColor'));
    const [dotButtonColor, setDotButtonColor] = useState(() => initial('dotButtonColor'));
    const [fontColor, setFontColor] = useState(() => initial('fontColor'));
    const resetTimer = speed * 1000; //reset timer in milliseconds
    const [playDash] = useSound(
        dashSound,
        { volume: volume / 100 }
    );
    const [playDot] = useSound(
        dotSound,
        { volume: volume / 100 }
    );
    const fSize = size + 'vh';
    const tfSize = (size - 7) + "vh"; //slightly smaller for sake of tower
    const sfSize = size / 3 + 'vh';
    var [startScreen, setStartScreen] = useState(true);
    var [endScreen, setEndScreen] = useState(false);

    //adapted from sandboxWords
    clearTimeout(t);
    t = setTimeout(function(){
        if(output != ' ')tower.push(output);
        setInput('');
    }, resetTimer);

    resetInputLength(input, setInput);

    

    const [handleKeyDown, setHandleKeyDown] = useState(true);
    document.onkeydown = function (evt) {
        if (!handleKeyDown) return; //
        setHandleKeyDown(false); //
        evt = evt || window.event;
        if (evt.keyCode === 32) {
            if (startScreen) {

            } else if (endScreen) {
                backToGames();
            } else {
                setInput(input + '•');
                playDot();
                document.getElementById('dotButton').focus();
            }

        } else if (evt.keyCode === 13) {
            if (startScreen) {
                setStartScreen(false);
            } else if (endScreen) {
                setEndScreen(false);
            } else {
                setInput(input + '-');
                playDash();
                document.getElementById('dashButton').focus();
            }
        }
    };

    document.onkeyup = function (evt) { //
        setHandleKeyDown(true); //
        document.activeElement.blur(); //
    }; //

    useImperativeHandle(
        ref,
        () => ({
            update() {
                setVolume(initial('volume'));
                setSize(initial('size'));
                setSpeed(initial('speed'));
                setBackgroundColor(initial('backgroundColor'));
                setDashButtonColor(initial('dashButtonColor'));
                setDotButtonColor(initial('dotButtonColor'));
                setFontColor(initial('fontColor'));
                setButtonColor(initial("buttonColor"));
            }
        }),
    )

    return (
        <div style={{
            backgroundColor: backgroundColor,
            height: '90vh',
            width: '100vw',
            display: 'grid',
            gridTemplate: '8fr 8fr / 1fr',
            gridTemplateAreas: '"top" "middle" "bottom'
        }}>
            <Transition
                items={startScreen}
                duration={500}
                from={{ opacity: 0 }}
                enter={{ opacity: 1 }}
                leave={{ opacity: 0 }}>
                {toggle =>
                    toggle
                        ? props => <div style={{
                            position: 'absolute',
                            width: '100vw',
                            height: '90vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1,
                            ...props
                        }}>
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'black',
                                opacity: 0.7
                            }} />
                            <Grid container direction='column' justify='center' alignItems='center' style={{ height: '100%', width: '100%', zIndex: 1 }}>
                                <Grid item style={{ userSelect: 'none', cursor: 'default' }}>
                                    <Card>
                                        <h1 style={{
                                            marginBottom: '0vh',
                                            fontSize: '8vh'
                                        }}>Tower Stack
                                        </h1>
                                        <br />
                                        <p style={{
                                            marginTop: '0vh',
                                            paddingLeft: '2vw',
                                            paddingRight: '2vw',
                                            fontSize: '4vh'
                                        }}>Type any Morse combination to add a letter to the stack.
                                        </p>
                                    </Card>
                                </Grid>
                                <br />
                                <Grid item style={{ userSelect: 'none' }}>
                                    <Card>
                                        <button id = "start" style={{ fontSize: '8vh', height: '100%', width: '100%', cursor: 'pointer' }}
                                                onMouseDown={function () {
                                                    if (startScreen) {
                                                        setStartScreen(false);
                                                    }
                                                }}>
                                            Press Enter (dash) to Start
                                        </button>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                        : props => <div />
                }
            </Transition>
            <div style={{gridArea: 'top'}}>
                <div style={{ position: 'absolute' }}>
                    <Container>
                        <Grid container justify='left'>
                            <Grid item>
                                <Link className='nav-link' to="/GamesThemes">
                                    <button style={{
                                        height: '90%',
                                        width: '100%',
                                        fontSize: '4vh',
                                        fontWeight: 800,
                                        userSelect: 'none',
                                        cursor: 'pointer',
                                        marginBottom: "20px"
                                    }}>Back</button>
                                </Link>
                            </Grid>
                        </Grid>
                    </Container>
                </div>
                <div>

                    <animated.h1 id = "output" style={{ //Letter
            //Hid all three of these to create space for the towers
                        lineHeight: 0,
                        color: fontColor,
                        fontSize: tfSize, //smaller font slightly for tower 
                        minHeight: '90%',
                        display: 'none'
                    }}>{output}</animated.h1>

                    <animated.h1 id="input" style={{ //Morse
                        //an attempt to reorganize the screen to get space for the tower
                        lineHeight: 0,
                        color: fontColor,
                        fontSize: sfSize,
                        display: 'none'
                    }}>{input}</animated.h1>
                </div>
                <div>
                    <Grid container direction='column' justify-content='center' alignItems='center' style={{ height: '100%', width: '100%', zIndex: 2 }}>
                    <animated.h1 id = "output" style={{ //Letter
                        lineHeight: 0,
                        right: '50%',
                        bottom: '50%',
                        transform: 'translate(50%,50%)',
                        position: 'absolute',
                        color: fontColor,
                        fontSize: tfSize //smaller font slightly for tower 
                    }}>{output}</animated.h1>
                    <animated.h1 id="input" style={{ //Morse
                        //an attempt to reorganize the screen to get space for the tower
                        lineHeight: 0,
                        color: fontColor,
                        fontSize: sfSize,
                        right: '50%',
                        bottom: '45%',
                        transform: 'translate(50%,50%)',
                        position: 'absolute',
                    }}>{input}</animated.h1>
                    <animated.h1 id="input" style={{ //Morse
                        //an attempt to reorganize the screen to get space for the tower
                        lineHeight: 0,
                        color: fontColor,
                        fontSize: sfSize,
                        right: '50%',
                        bottom: '45%',
                        transform: 'translate(50%,50%)',
                        position: 'absolute',
                    }}>{input}</animated.h1>
                    <animated.h1 id="input" style={{ //Morse
                        //temporary to demonstrate adding to array
                        lineHeight: 0,
                        color: fontColor,
                        fontSize: sfSize,
                        right: '50%',
                        bottom: '45%',
                        transform: 'translate(50%,50%)',
                        position: 'absolute',
                    }}>{tower[tower.length - 1] + ' ' + tower.length}</animated.h1>
                    </Grid>
                </div>
            </div>
            <ButtonsWithoutInput
                fontColor={fontColor}
                backgroundColor={backgroundColor}
                buttonColor={buttonColor}
                dotButtonColor={dotButtonColor}
                dashButtonColor={dashButtonColor}
                volume={volume}
                input={input}
                setInput={setInput}
            />
        </div>
    );
})

const Radio = () => {
    const [isToggled, setToggle] = useState(false);
    const menubg = useSpring({ background: isToggled ? "#6ce2ff" : "#ebebeb" });
    const { y } = useSpring({
        y: isToggled ? 180 : 0
    });
    const menuAppear = useSpring({
        transform: isToggled ? "translate3D(0,0,0)" : "translate3D(0,-40px,0)",
        opacity: isToggled ? 1 : 0
    });

    return (
        <div style={{ position: "relative", width: "300px", margin: "0 auto" }}>
            <animated.button
                style={menubg}
                className="radiowrapper"
                onClick={() => setToggle(!isToggled)}
            >
                <div className="radio">
                    <p>Tutorial</p>
                    <animated.p
                        style={{
                            transform: y.interpolate(y => `rotateX(${y}deg)`)
                        }}
                    >
                        ▼
                    </animated.p>
                </div>
            </animated.button>
            <animated.div style={menuAppear}>
                {isToggled ? <RadioContent /> : null}
            </animated.div>
        </div>
    );
};

const RadioContent = () => {
    return (
        <div className="radiocontent" >
            <a href="#" alt="Home">
            </a>
            <p id="tutorialText" value="Change Text">Welcome to the Tower Stack game!</p>
            <img src={spacebar} alt="Spacebar" id="spaceImage" style={{ display: "none" }}></img>
            <img src={enterButton} alt="Enter Button" id="enterImage" style={{ display: "none" }}></img>
            <button onClick={function () {
                updateTutorial();
            }} style={{ fontSize: '5vh' }}>Next</button>
        </div>
    );
};

export default towerStack;