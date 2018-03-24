import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Button, ButtonGroup, ButtonDropdown, Collapse, Card, CardBody} from 'reactstrap';
import { Table ,Fade} from 'reactstrap';
import { UncontrolledTooltip } from 'reactstrap';
import { SyncLoader } from 'react-spinners';



class App extends Component {

    constructor() {
        super()
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = {
            output: [],
            size: 'SIZE',
            floor : true,
            dropdownOpen: false,
            rSelected: 'floor',
            loading: true
        }
    }
    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }
    onRadioBtnClick(rSelected) {
        this.setState({ rSelected });
    }
    handleFormSubmit(formSubmitEvent) {
        formSubmitEvent.preventDefault();
        axios.post('http://localhost:3000/tiles/createType', {
            floor: this.state.floor
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    handleOptionChange(changeEvent) {
        if (changeEvent.target.value === 'floor'){
            this.setState({
                floor: true
            });     
        } else {
            this.setState({
                floor: false
            });     
        }
    }
    createType(type) {
        console.log(type)
    }
    getAllTiles() {
        this.setState({
            collapse : !this.state.collapse
        })
        var thisout = this;
        setTimeout(function(){ 
            axios.get('http://localhost:4000/graphql?query={getTiles{name internalId}}')
            .then((res) => {
                thisout.setState({
                    output: res.data.data.getTiles,
                    loading: false
                })
        });
        }, 3000);

        
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">GraphQL + React Sample App</h1>
                </header>
                <br/>
                <Collapse isOpen={this.state.collapse}>
                    <Card>
                        <CardBody>
                            Tiles from the graphQL query:<br/><code>&#123;getTiles&#123;name internalId&#125;&#125;</code> 
                        </CardBody>
                    </Card>
                    <div className='sweet-loading'>
                        <br/>
                        <SyncLoader
                          color={'#2f89e9'} 
                          loading={this.state.loading} 
                        />
                    </div>
                    <Fade in={!this.state.loading}>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>NAME</th>
                                    <th>ID  </th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.output.map(tile => (
                                    <tr><th scope="row">{tile.name}</th><th scope="row">{tile.internalId}</th></tr>
                                ))
                            }
                            </tbody>
                        </Table>
                    </Fade>

                </Collapse>
                <div>
                    <Button size="lg"  color="primary" onClick={() => this.getAllTiles() }>ALL TILES</Button>{' '}
                </div>
                <hr/>
                <div>
                    <ButtonGroup id="TooltipExample">
                        <Button color="primary" onClick={() => this.onRadioBtnClick('wall')} active={this.state.rSelected === 'wall'}>WALL</Button>
                        <Button color="primary" onClick={() => this.onRadioBtnClick('floor')} active={this.state.rSelected === 'floor'}>FLOOR</Button>
                    </ButtonGroup>
                    <UncontrolledTooltip placement="right" target="TooltipExample">
                        Floor or Wall tile?
                    </UncontrolledTooltip>
                    <p>Selected: {this.state.rSelected}</p>
                </div>
                <div>
                    <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret color="primary">
                            {this.state.size}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={()=> {this.setState({size:'10x10'})}}>10x10</DropdownItem>
                            <DropdownItem onClick={()=> {this.setState({size:'20x20'})}}>20x20</DropdownItem>
                            <DropdownItem onClick={()=> {this.setState({size:'30x30'})}}>30x30</DropdownItem>
                            <DropdownItem onClick={()=> {this.setState({size:'32x32'})}}>32x32</DropdownItem>
                            <DropdownItem onClick={()=> {this.setState({size:'34x34'})}}>34x34</DropdownItem>
                            <DropdownItem onClick={()=> {this.setState({size:'38x38'})}}>38x38</DropdownItem>
                            <DropdownItem onClick={()=> {this.setState({size:'40x40'})}}>40x40</DropdownItem>
                        </DropdownMenu>
                    </ButtonDropdown>
                </div>
                <br/>
                <div>
                    <Button  color="success">SUBMIT</Button>{' '}
                </div>
                <br/>
            </div>
        );
    }
}

export default App;
