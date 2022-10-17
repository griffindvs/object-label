import React from 'react';

import BoundingBox from '../BoundingBox';

import { initializeApp } from 'firebase/app';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import firebaseConfig from "../../firebaseConfig.json";

const NUM_IMAGES = 2243;
const classes = ['kettle', 'measuring_cup', 'mug', 'kettle_lid', 'filter_cone', 'paper_filter'];
const NUM_LABELS = classes.length;

function pickImage() {
    // Random integer from (1, NUM_IMAGES)
    let imageNum = Math.floor(Math.random() * NUM_IMAGES)+1;
    // imageNum = String(imageNum).padStart(3, '0');
    return `${imageNum}.jpg`;
}

function pickClass() {
    // Random integer from (0, NUM_LABELS)
    let classNum = Math.floor(Math.random() * NUM_LABELS);
    return classes[classNum];
}

class ImageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classLabel: "",
            image: ""
        };

        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app);
    }

    componentDidMount() {
        this.setState({
            image: pickImage(),
            classLabel: pickClass()
        });
    }

    async handleSubmit(box) {
        // Write bounding box, label, and image to Firestore collection
        let docRef = await addDoc(collection(this.db, "labelled"), {
            image: this.state.image,
            class: this.state.classLabel,
            user: this.props.user,
            top_left_x: box.topLeftX,
            top_left_y: box.topLeftY,
            bottom_right_x: box.bottomRightX,
            bottom_right_y: box.bottomRightY,
        });
        console.log("Wrote document as " + docRef.id);

        this.setState({
            image: pickImage(),
            classLabel: pickClass()
        });
    }

    handleSkip() {
        this.setState({
            image: pickImage(),
            classLabel: pickClass()
        });
    }

    render() {
        return (
            <div>
                <BoundingBox image={this.state.image} classLabel={this.state.classLabel} 
                    onSubmit={this.handleSubmit.bind(this)} onSkip={this.handleSkip.bind(this)} />
            </div>
        );
    }
}

export default ImageContainer;