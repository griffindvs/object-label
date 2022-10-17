import React, { useEffect, useState, useRef } from 'react';

import { Button, ButtonGroup, Container } from 'reactstrap';

import './index.css';

const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 360;

class BoundingBox extends React.Component {
    constructor(props) {
        super(props);

        this.startX = null;
        this.startY = null;
        this.width = 0;
        this.height = 0;
        this.drag = false;

        this.canvasRef = React.createRef();
        this.canvas = null;
        this.ctx = null;
        this.imageObj = new Image;
    }

    componentDidMount() {
        this.canvas = this.canvasRef.current;
        this.ctx = this.canvas.getContext('2d');

        this.imageObj.onload = () => { this.ctx.drawImage(this.imageObj, 0, 0) };
        this.imageObj.src = process.env.PUBLIC_URL + "/img/" + this.props.image;
        
        this.canvas.addEventListener('mousedown', this.mouseDown.bind(this), false);
        this.canvas.addEventListener('mouseup', this.mouseUp.bind(this), false);
        this.canvas.addEventListener('mousemove', this.mouseMove.bind(this), false);
        this.ctx.strokeStyle = '#03cafc';
        this.ctx.lineWidth = 2;
    }

    componentDidUpdate() {
        console.log("Image: " + this.imageObj.src)
        this.imageObj.onload = () => { this.ctx.drawImage(this.imageObj, 0, 0) };
        this.imageObj.src = process.env.PUBLIC_URL + "/img/" + this.props.image;
    }

    getMousePos(evt) {
        var rect = this.canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

    mouseDown(e) {
        e.preventDefault();
        e.stopPropagation();
        let pos = this.getMousePos(e);
        this.startX = pos.x;
        this.startY = pos.y;
        this.width = 0;
        this.height = 0;
        this.drag = true;
        this.ctx.restore();
    }

    mouseUp(e) {
        e.preventDefault();
        e.stopPropagation();
        this.drag = false;
        this.ctx.save();
    }

    mouseMove(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.drag) {
            return;
        }

        let pos = this.getMousePos(e);
        let curX = pos.x;
        let curY = pos.y;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.imageObj, 0, 0);
        
        this.width = curX - this.startX;
        this.height = curY - this.startY;
        this.ctx.strokeRect(this.startX, this.startY, this.width, this.height);
    }

    handleReset() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.imageObj, 0, 0);
        this.ctx.save();
    }

    handleSubmit() {
        let box = {
            topLeftX: 0,
            topLeftY: 0,
            bottomRightX: 0,
            bottomRightY: 0
        }

        if (this.width > 0) {
            box.topLeftX = this.startX;
            box.bottomRightX = this.startX + this.width;
        } else {
            box.topLeftX = this.startX + this.width;
            box.bottomRightX = this.startX;
        }

        if (this.height > 0) {
            box.topLeftY = this.startY;
            box.bottomRightY = this.startY + this.height;
        } else {
            box.topLeftY = this.startY + this.height;
            box.bottomRightY = this.startY;
        }
        console.log("Box boundaries:")
        console.log(box);

        this.props.onSubmit(box);
    }

    render() {
        return (
            <div>
                <div className="canvasContainer">
                    <canvas height={IMAGE_HEIGHT} width={IMAGE_WIDTH} ref={this.canvasRef} />
                </div>
                <Container>
                    <p className="imageContainerInstructions">Please draw a box around the {this.props.classLabel}</p>
                    <ButtonGroup>
                        <Button color="danger" onClick={this.handleReset.bind(this)}>
                            Reset
                        </Button>
                        <Button color="primary" onClick={this.handleSubmit.bind(this)}>
                            Submit
                        </Button>
                        <Button color="secondary" onClick={this.props.onSkip}>
                            Skip
                        </Button>
                    </ButtonGroup>
                </Container>
            </div>
        );
    }
}

export default BoundingBox;