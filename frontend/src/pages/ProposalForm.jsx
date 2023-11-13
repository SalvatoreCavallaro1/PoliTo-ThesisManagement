//import dayjs from 'dayjs';

import {useState, useContext} from 'react';
import {Form, Button, Alert, Image, Row, Col} from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import Navigation from "./Navigation";
import API from '../API';
// import MessageContext from '../messageCtx';



const ProposalForm = (props) => {
   
    const [title, setTitle] = useState(props.page ? props.page.title : '');
    const [supervisor, setSupervisor] = useState(props.page ? props.page.supervisor : '');
    const [co_supervisor, setCoSupervisor] = useState(props.page ? props.page.co_supervisor : '');
    const [type, setType] = useState(props.page ? props.page.type : '');
    const [expiration, setExpirationDate] = useState(props.page ? props.page.expiration : '');
    const [level, setLevel] = useState(props.page ? props.page.level : '');
    const [groups, setGroups] = useState(props.page ? props.page.groups : '');
    const [keywords, setKeywords] = useState(props.page ? props.page.keywords : '');
    const [description, setDescription] = useState(props.page ? props.page.description : '');
    const [required_knowledge, setRequiredKnowledge] = useState(props.page ? props.page.required_knowledge : '');
    const [notes, setNotes] = useState(props.page ? props.page.notes : '');
    const [programmes, setPrograms] = useState(props.page ? props.page.programmes : '');
    

    // useNavigate hook to change page
    const navigate = useNavigate();
    const location = useLocation();
    //const {handleErrors} = useContext(MessageContext);

    // if the page is successfully added or edited we return to the user's page(logged in), 
    // otherwise, if cancel is pressed, we go back to the previous location.
    const nextpage = location.state?.nextpage || '/';

    const addProposal = (proposal) => {
      API.addProposal(proposal)
      .then(() => {
        console.log("yes!!!");
      })
        .catch(e => handleErrors(e)); 
    }

    const handleSubmit = (event) => {
      event.preventDefault();
  
      const proposal = {
        "title": title.trim(),
        "supervisor": supervisor,
        "co_supervisor": co_supervisor,
        "type": type,
        "expiration": expiration,
        "level": level,
        "groups": groups,
        "keywords": keywords,
        "description": description.trim(),
        "required_knowledge": required_knowledge.trim(),
        "notes": notes.trim(),
        "programmes": programmes.trim(),
        "teacher_id": "1",
      };
  
      console.log(proposal);
      addProposal(proposal);
  

      // API.addProposal(proposal)
      // .then(() => {
      //   // Optionally, you can do something after a successful submission

      //   // Navigate to the next page
      //   navigate(nextpage);
      // })
      // .catch(error => {
      //   console.error('Error submitting proposal:', error);
      //   // Handle errors appropriately
      // });


     navigate(nextpage);
    }


    

    const handleTextChange = (index, value) => {
        const updatedBlocks = [...blocks];
        updatedBlocks[index].value = value;
        setBlocks(updatedBlocks);
    };
      

    
    return (
        <>
            <Navigation/>

            <div className="my-3 text-center fw-bold fs-1">
              <p>Insert a New Proposal</p>
            </div>

            <Form className="block-example rounded mb-1 form-padding mt-5" onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-end align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Title</Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control type="text" required={true} value={title} onChange={event => setTitle(event.target.value)} />
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-start align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Expiration Date</Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control type="date" value={expiration} onChange={event => setExpirationDate(event.target.value) } />
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-end align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Supervisor</Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control type="text" required={true} value={supervisor} onChange={event => setSupervisor(event.target.value)} />
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-start align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Level</Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control type="text" required={true} value={level} onChange={event => setLevel(event.target.value)} />
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-end align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Co-Supervisors</Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control type="text" required={false} value={co_supervisor} onChange={event => setCoSupervisor(event.target.value)} />
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-start align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Groups</Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control type="text" required={false} value={groups} onChange={event => setGroups(event.target.value)} />
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-end align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Type</Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control
                            as="select"
                            required={true}
                            value={type}
                            onChange={(event) => setType(event.target.value)}>
                            <option value="" >
                            Choose one of the options below
                            </option>
                            <option value="option1">Bachelor's degree</option>
                            <option value="option2">Master's degree</option>
                          </Form.Control>
                       </Col>
                      </Row>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                     <Row className="d-flex justify-content-start align-items-center">
                      <Col xs={12} md={2} className="text-md-end">
                        <Form.Label>Keywords</Form.Label>
                      </Col>
                      <Col xs={12} md={6}>
                        <Form.Control type="text" required={true} value={keywords} onChange={event => setKeywords(event.target.value)} />
                      </Col>
                     </Row>
                    </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                  <Row className="d-flex justify-content-start align-items-center">
                    <Col xs={12} md={3} className="text-md-end">
                      <Form.Label>CdS/Programs</Form.Label>
                    </Col>
                    <Col xs={12} md={7}>
                      <Form.Control as="textarea" rows={2} required={false} value={programmes} onChange={event => setPrograms(event.target.value)} />
                    </Col>
                  </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                  <Row className="d-flex justify-content-start align-items-center">
                    <Col xs={12} md={3} className="text-md-end">
                      <Form.Label>Description</Form.Label>
                    </Col>
                    <Col xs={12} md={7}>
                      <Form.Control as="textarea" rows={3} required={true} value={description} onChange={(event) => setDescription(event.target.value)} />
                    </Col>
                  </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                  <Row className="d-flex justify-content-start align-items-center">
                    <Col xs={12} md={3} className="text-md-end">
                     <Form.Label>Required Knowledge</Form.Label>
                    </Col>
                    <Col xs={12} md={7}>
                     <Form.Control as="textarea" rows={3} required={true} value={required_knowledge} onChange={event => setRequiredKnowledge(event.target.value)} />
                    </Col>
                  </Row>
              </Form.Group>
            
              <Form.Group className="mb-3">
                  <Row className="d-flex justify-content-start align-items-center">
                    <Col xs={12} md={3} className="text-md-end">
                      <Form.Label>Notes</Form.Label>
                    </Col>
                    <Col xs={12} md={7}>
                      <Form.Control as="textarea" rows={3} required={false} value={notes} onChange={event => setNotes(event.target.value)} />
                    </Col>
                  </Row>
              </Form.Group>

                

              <div className="d-flex justify-content-center">
                <Button className="m-2" variant="success" type="submit">Insert</Button>&nbsp;  
                <Link className="btn btn-danger m-2"  to={nextpage}>Go Back </Link>   
              </div>



              
            </Form>
        </>
    )
    
}

export default ProposalForm;