import React from 'react';

import { Container, Row, Col, Accordion, AccordionItem, AccordionHeader, AccordionBody } from 'reactstrap'

import BoundingBox from '../BoundingBox';

import './index.css';
import LABELS from './labels.json';

import { initializeApp } from 'firebase/app';
import { collection, addDoc, getFirestore, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from "../../firebaseConfig.json";

const NUM_IMAGES = 2600;

function pickImage() {
    // Random integer from (1, NUM_IMAGES)
    let imageNum = Math.floor(Math.random() * NUM_IMAGES)+1;
    // imageNum = String(imageNum).padStart(3, '0');
    return imageNum;
}

function pickClass() {
    // First get image
    let imageNum = pickImage();
    console.log("Picked image " + imageNum);

    // Next get label set using imageNum
    let curLabels = [];
    for (let key in LABELS) {
        if (LABELS.hasOwnProperty(key)) {
            if (parseInt(key) >= imageNum) {
                console.log("Found section: " + key);
                // Found label set
                curLabels = LABELS[key];
                break;
            }
        }
    }

    // Pick label
    let classNum = Math.floor(Math.random() * curLabels.length-1)+1;
    let classLabel = curLabels[classNum];

    console.log(curLabels);
    console.log("Picked " + classLabel);

    return {
        classLabel: classLabel,
        image: `${imageNum}.jpg`,
    }
}

class ImageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classLabel: "",
            image: "",
            accordionOpen: '',
            nestedAccordion: ''
        };

        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app);
    }

    componentDidMount() {
        let newLoad = pickClass();

        this.setState((state) => {
            return {
                image: newLoad['image'],
                classLabel: newLoad['classLabel'],
                accordionOpen: state.accordionOpen,
                nestedAccordion: state.nestedAccordion
            }
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
            timestamp: serverTimestamp()
        });
        console.log("Wrote document as " + docRef.id);

        let newLoad = pickClass();
        this.setState((state) => {
            return {
                image: newLoad['image'],
                classLabel: newLoad['classLabel'],
                accordionOpen: state.accordionOpen,
                nestedAccordion: state.nestedAccordion
            }
        });
    }

    handleSkip() {
        let newLoad = pickClass();

        this.setState((state) => {
            return {
                image: newLoad['image'],
                classLabel: newLoad['classLabel'],
                accordionOpen: state.accordionOpen,
                nestedAccordion: state.nestedAccordion
            }
        });
    }

    toggleAccordion = (id) => {
        if (this.state.accordionOpen === id) {
            this.setState((state) => {
                return {
                    image: state.image,
                    classLabel: state.classLabel,
                    accordionOpen: '',
                    nestedAccordion: ''
                }
            });
        } else {
            this.setState((state) => {
                return {
                    image: state.image,
                    classLabel: state.classLabel,
                    accordionOpen: id,
                    nestedAccordion: state.nestedAccordion   
                }
            });
        }
    }

    toggleNestedAccordion = (id) => {
        if (this.state.nestedAccordion === id) {
            this.setState((state) => {
                return {
                    image: state.image,
                    classLabel: state.classLabel,
                    accordionOpen: state.accordionOpen,
                    nestedAccordion: ''
                }
            });
        } else {
            this.setState((state) => {
                return {
                    image: state.image,
                    classLabel: state.classLabel,
                    accordionOpen: state.accordionOpen,
                    nestedAccordion: id   
                }
            });
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <BoundingBox image={this.state.image} classLabel={this.state.classLabel} 
                            onSubmit={this.handleSubmit.bind(this)} onSkip={this.handleSkip.bind(this)} />
                        <br />
                        <p>If image or label are blank, please press Skip.</p>
                        <p>If the label is not found in the image, please also press Skip.</p>
                    </Col>
                    <Col>
                        <h3 className="my-4">Example Images:</h3>
                        <Accordion open={this.state.accordionOpen} toggle={this.toggleAccordion}>
                            <AccordionItem>
                                <AccordionHeader targetId="1">
                                    Measuring cup
                                </AccordionHeader>
                                <AccordionBody accordionId="1">
                                    <img src={process.env.PUBLIC_URL + "/assets/examples/measuring_cup.png"} 
                                    alt="Measuring cup" width="500px" />
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="2">
                                    Kettle
                                </AccordionHeader>
                                <AccordionBody accordionId="2">
                                    <img src={process.env.PUBLIC_URL + "/assets/examples/kettle.png"} 
                                    alt="Kettle" width="500px" />
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="3">
                                    Kettle lid
                                </AccordionHeader>
                                <AccordionBody accordionId="3">
                                    <img src={process.env.PUBLIC_URL + "/assets/examples/kettle_lid.png"} 
                                    alt="Kettle lid" width="500px" />
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="4">
                                    Filter cone
                                </AccordionHeader>
                                <AccordionBody accordionId="4">
                                    <img src={process.env.PUBLIC_URL + "/assets/examples/filter_cone.png"} 
                                    alt="Filter cone" width="500px" />
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="5">
                                    Paper filter (circle/half/quarter)
                                </AccordionHeader>
                                <AccordionBody accordionId="5">
                                    <Accordion open={this.state.nestedAccordion} toggle={this.toggleNestedAccordion}>
                                        <AccordionItem>
                                            <AccordionHeader targetId="1">
                                                Paper filter circle
                                            </AccordionHeader>
                                            <AccordionBody accordionId="1">
                                                <img src={process.env.PUBLIC_URL + "/assets/examples/paper_filter_circle.png"} 
                                                alt="Paper filter circle" width="300px" />
                                            </AccordionBody>
                                        </AccordionItem>
                                        <AccordionItem>
                                            <AccordionHeader targetId="2">
                                                Paper filter half
                                            </AccordionHeader>
                                            <AccordionBody accordionId="2">
                                                <img src={process.env.PUBLIC_URL + "/assets/examples/paper_filter_half.png"} 
                                                alt="Paper filter half" width="300px" />
                                            </AccordionBody>
                                        </AccordionItem>
                                        <AccordionItem>
                                            <AccordionHeader targetId="3">
                                                Paper filter quarter
                                            </AccordionHeader>
                                            <AccordionBody accordionId="3">
                                                <img src={process.env.PUBLIC_URL + "/assets/examples/paper_filter_quarter.png"} 
                                                alt="Paper filter quarter" width="300px" />
                                            </AccordionBody>
                                        </AccordionItem>
                                    </Accordion>
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="6">
                                    Coffee Grinder and Lid
                                </AccordionHeader>
                                <AccordionBody accordionId="6">
                                    <Container>
                                        <Row>
                                            <Col>
                                                Coffee grinder and lid combined:
                                                <img src={process.env.PUBLIC_URL + "/assets/examples/coffee_grinder_combined.jpeg"} 
                                                    alt="Coffee grinder and lid combined" width="500px" />
                                            </Col>
                                            <Col>
                                                Coffee grinder and lid separate:
                                                <img src={process.env.PUBLIC_URL + "/assets/examples/coffee_grinder_separate.jpeg"} 
                                                    alt="Coffee grinder and lid separate" width="500px" />
                                            </Col>
                                        </Row> 
                                    </Container>
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="8">
                                    Coffee Beans
                                </AccordionHeader>
                                <AccordionBody accordionId="8">
                                    <img src={process.env.PUBLIC_URL + "/assets/examples/coffee_beans.png"} 
                                    alt="Coffee beans" width="500px" />
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="9">
                                    Coffee Grounds
                                </AccordionHeader>
                                <AccordionBody accordionId="9">
                                    <img src={process.env.PUBLIC_URL + "/assets/examples/coffee_grounds.png"} 
                                    alt="Coffee grounds" width="500px" />
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="10">
                                    Thermometer
                                </AccordionHeader>
                                <AccordionBody accordionId="10">
                                    <img src={process.env.PUBLIC_URL + "/assets/examples/thermometer.png"} 
                                    alt="Thermometer" width="500px" />
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="11">
                                    Kitchen Scale
                                </AccordionHeader>
                                <AccordionBody accordionId="11">
                                    <img src={process.env.PUBLIC_URL + "/assets/examples/kitchen_scale.png"} 
                                    alt="Kitchen scale" width="500px" />
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="12">
                                    Mug
                                </AccordionHeader>
                                <AccordionBody accordionId="12">
                                    <img src={process.env.PUBLIC_URL + "/assets/examples/mug.png"} 
                                    alt="Mug" width="500px" />
                                </AccordionBody>
                            </AccordionItem>
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default ImageContainer;