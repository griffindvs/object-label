import React from 'react';

import { Button, ButtonGroup, Container, Alert } from 'reactstrap';

import './index.css';

const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 360;

class BoundingBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            invalidSubmit: false,
            addedBox: false
        };

        this.startX = null;
        this.startY = null;
        this.width = 0;
        this.height = 0;
        this.drag = false;

        this.canvasRef = React.createRef();
        this.canvas = null;
        this.ctx = null;
        this.imageObj = new Image();
    }

    componentDidMount() {
        this.canvas = this.canvasRef.current;
        this.ctx = this.canvas.getContext('2d');

        // Draw empty rectangle while we wait for image
        this.ctx.fillStyle = "#d6d6d6"
        this.ctx.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT)
        
        // Add listeners
        this.canvas.addEventListener('mousedown', this.mouseDown.bind(this), false);
        this.canvas.addEventListener('mouseup', this.mouseUp.bind(this), false);
        this.canvas.addEventListener('mouseout', this.mouseUp.bind(this), false);
        this.canvas.addEventListener('mousemove', this.mouseMove.bind(this), false);
        
        // Setup stroke style for bounding box
        this.ctx.strokeStyle = '#03cafc';
        this.ctx.setLineDash([10, 10]);
        this.ctx.lineWidth = 2;
    }

    componentDidUpdate() {
        this.imageObj.onload = () => { this.ctx.drawImage(this.imageObj, 0, 0) };
        this.imageObj.src = process.env.PUBLIC_URL + "/img/" + this.props.image;
    }

    getMousePos(evt) {
        // Get offsets on sides and top of canvas
        var rect = this.canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

    mouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            invalidSubmit: false,
            addedBox: true
        });

        // Get mouse position within canvas
        let pos = this.getMousePos(e);

        // Start drawing bounding box
        this.startX = pos.x;
        this.startY = pos.y;
        this.width = 0;
        this.height = 0;
        this.drag = true;

        // Erase old bounding box
        this.ctx.restore();
    }

    mouseUp(e) {
        e.preventDefault();
        e.stopPropagation();

        // Stop dragging
        this.drag = false;

        // Save new bounding box
        this.ctx.save();
    }

    mouseMove(e) {
        e.preventDefault();
        e.stopPropagation();

        // Not currently dragging
        if (!this.drag) {
            return;
        }

        // Get mouse position within canvas
        let pos = this.getMousePos(e);
        let curX = pos.x;
        let curY = pos.y;
        
        // Clear old rectangle
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.imageObj, 0, 0);
        
        // Draw new rectangle
        this.width = curX - this.startX;
        this.height = curY - this.startY;
        this.ctx.strokeRect(this.startX, this.startY, this.width, this.height);
    }

    handleReset() {
        // Clear canvas and save state
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.imageObj, 0, 0);
        this.ctx.save();

        this.setState({
            invalidSubmit: false,
            addedBox: false
        });
    }

    handleSkip() {
        this.setState({
            invalidSubmit: false,
            addedBox: false
        });

        this.props.onSkip();
    }

    handleSubmit() {
        // Check that the user made a selection
        if (this.width === 0 || this.height === 0 || !this.state.addedBox) {
            this.setState({
                invalidSubmit: true,
                addedBox: false
            });
            return;
        }

        // Object to store results
        let box = {
            topLeftX: 0,
            topLeftY: 0,
            bottomRightX: 0,
            bottomRightY: 0
        }

        // Calculate needed coordinates (top left / bottom right)
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

        // Reset
        this.startX = null;
        this.startY = null;
        this.width = 0;
        this.height = 0;

        this.setState({
            invalidSubmit: false,
            addedBox: false
        });

        // Pass up to higher level component ImageContainer
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
                        <Button color="secondary" onClick={this.handleSkip.bind(this)}>
                            Skip
                        </Button>
                    </ButtonGroup>
                    { this.state.invalidSubmit && <Alert className="invalidSubmitAlert" color="danger">
                        Please add a selection before pressing submit. If the requested label is not found in the image, press skip.
                    </Alert> }
                </Container>
            </div>
        );
    }
}

export default BoundingBox;