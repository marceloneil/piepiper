import React, {Component} from 'react';
import {SketchField, Tools} from 'react-sketch';
import {
    AppBar,
    Card,
    CardHeader,
    CardText,
    GridList,
    GridTile,
    IconButton,
    MenuItem,
    SelectField,
    Slider,
    TextField,
    Toggle,
    ToolbarSeparator,
    FloatingActionButton,
    RaisedButton,
    FlatButton

} from 'material-ui';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import UndoIcon from 'material-ui/svg-icons/content/undo';
import RedoIcon from 'material-ui/svg-icons/content/redo';
import ClearIcon from 'material-ui/svg-icons/action/delete';
import SaveIcon from 'material-ui/svg-icons/content/save';
import RightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import LeftIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left';

import Carousel from './react-image-carousel';
require("./react-image-carousel/lib/css/main.min.css");




const styles = {
    root: {
        padding: '3px',
        display: 'flex',
        flexWrap: 'wrap',
        margin: '10px 10px 5px 10px',
        justifyContent: 'space-around'
    },
    gridList: {
        width: '100%',
        overflowY: 'auto',
        marginBottom: '24px'
    },
    gridTile: {
        backgroundColor: '#fcfcfc'
    },
    appBar: {
        backgroundColor: '#8fbbff'
    },
    radioButton: {
        marginTop: '3px',
        marginBottom: '3px'
    },
    separator: {
        height: '42px',
        backgroundColor: 'white'
    },
    iconButton: {
        fill: 'white',
        width: '42px',
        height: '42px'
    },
    dropArea: {
        width: '100%',
        height: '64px',
        border: '2px dashed rgb(102, 102, 102)',
        borderStyle: 'dashed',
        borderRadius: '5px',
        textAlign: 'center',
        paddingTop: '20px'
    },
    activeStyle: {
        borderStyle: 'solid',
        backgroundColor: '#eee'
    },
    rejectStyle: {
        borderStyle: 'solid',
        backgroundColor: '#ffdddd'
    }
};

const muiTheme = getMuiTheme({
    slider: {
        trackColor: 'gray',
        selectionColor: 'white',
        trackSize : 10,
        handleSize:10
    },
});

const images = [
        'http://piepiper.1lab.me/images/d025a4f11da5158b7bd07ce99499415ab6a4d2a461fe6d252e38539223ef7e62.png',
        'http://piepiper.1lab.me/images/ac47b4d95da31f22cd151a1d20a07f923ded25b98940884fc9ca3925dbf24ebe.png',
        'http://piepiper.1lab.me/images/9f226dc2bfebffae3bc6bc4e7b3469ab51ea764c9ca4cc653f9208e23cd0f3f9.png',
        'http://piepiper.1lab.me/images/877ad8716e61126bc957db27452a7a63adf7150b5885cd682de06a2c38e7f46e.png',
        'http://piepiper.1lab.me/images/b3207f0228d3796121e344f32c828d207db7a4de7adac5f964b0be18c967e6c7.png',
        'http://piepiper.1lab.me/images/e9870a0af05d0cfab0ac87cebe2a7f251130662df337530dfbfb774c01a7ad46.png',
        ''
];

class App extends Component {
    state = {
        tool: Tools.Pencil,
        lineWidth: 5,
        drawings: [],
        urls: [],
        renderedImages: [],
        canUndo: false,
        canRedo: false,
        index: 0,
        totalFrames:1,
        currentFrame:null,
        penColor: 'black',
        toolName: Tools.Pencil,
        middleOut: false,
        token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    };

    componentDidMount() {
        document.title = "PiePiper";
    }

    selectTool (even, index, value) {
        if (value === Tools.Pencil) this.setState({penColor: 'black'});
        if (value === "Eraser") {this.setState({penColor: 'white', toolName: 'Eraser'}); value = Tools.Pencil;}
        else this.setState({toolName: value, penColor: 'black'});
        this.setState({
            tool: value,
        });
    }

    onSketchChange = () => {
        let prev = this.state.canUndo;
        let now = this._sketch.canUndo();
        if (prev !== now) {
            this.setState({canUndo: now});
        }
    };

    save () {
        let drawings = this.state.drawings;
        let index = this.state.index;
        let uri = this._sketch.toDataURL();
        let urls = this.state.urls;
        if (drawings[index]) drawings[index] = uri;
        else drawings.push(uri);

        this.setState({drawings: drawings});

        fetch('http://piepiper.1lab.me/api/upload', {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                index: index,
                uri: uri,
                token: this.state.token
            })
        })
        .then(res => res.json())
        .then( (response) => {
            let item = response.file;

            console.log(item);

            if (urls[index]) urls[index] = item;
            else urls.push(item);

            this.setState({urls:urls});
        });
    }

    middleOut() {
        //this.setState({middleOut: !this.state.middleOut});
        fetch('http://piepiper.1lab.me/api/middleout', {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                token: this.state.token,
            })
        })
            .then(res => res.json())
            .then( (response) => {
                console.log(response.frames);

                this.setState({
                    middleOut: !this.state.middleOut,
                    renderedImages: response.frames
                });
            });
    }

    undo () {
        this._sketch.undo();

        this.setState({
            canUndo: this._sketch.canUndo(),
            canRedo: this._sketch.canRedo(),
        })
    }

    redo () {
        this._sketch.redo();

        this.setState({
            canUndo: this._sketch.canUndo(),
            canRedo: this._sketch.canRedo(),
        })
    }
    next() {
        this.save();
        this.clear();

        let flag = false;

        let index = this.state.index;
        let totalFrames = this.state.totalFrames;
        if (index+1===totalFrames) {
            flag = true;
            totalFrames++;
            index++;
        } else {
            index++;
        }

        this.setState({
            index: index,
            totalFrames: totalFrames,
        });
        if (index < this.state.drawings.length && this.state.drawings[index]) {
            this._sketch.addImg(this.state.urls[index], {left:0, top: 0, scale:1.0});
        } else if (flag) {
            console.log(flag);
            setTimeout(()=>{this._sketch.addImg(this.state.urls[index-1], {left:0, top: 0, scale:1.0});}, 1000);
            console.log(this.state.urls[index-1]);

        }

    }

    prev() {
        let index = this.state.index;
        let totalFrames = this.state.totalFrames;
        if (index !== 0) {
            this.save();
            this.clear();
            index--;
            if (index < this.state.drawings.length && this.state.drawings[index]) {
                this._sketch.addImg(this.state.urls[index], {left:0, top: 0, scale:1.0});
            }
            this.setState({index: index});
        }
    }

    clear = () => {
        this._sketch.clear();
        this.setState({
            canUndo: this._sketch.canUndo(),
            canRedo: this._sketch.canRedo()
        })
    };

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <div className='row'>
                        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                            <AppBar title={<span style={{fontSize: 36, fontWeight: 'bold'}}>PiePiper</span>} showMenuIconButton={false} style={styles.appBar}>
                                <button
                                    onClick={this.middleOut.bind(this)}
                                    style={{alignSelf: 'center', height: 36, borderRadius:5, color: 'white', outline: 'none', borderColor:'#8fbbff', cursor:'pointer'}}
                                >
                                    <span style={{fontSize: 24, fontWeight: 'bold', color: '#8fbbff'}}>Middle Out!</span>
                                </button>
                                <IconButton
                                    onClick={this.undo.bind(this)}
                                    iconStyle={styles.iconButton}
                                    disabled={!this.state.canUndo}>
                                    <UndoIcon/>
                                </IconButton>
                                <IconButton
                                    onClick={this.redo.bind(this)}
                                    iconStyle={styles.iconButton}
                                    disabled={!this.state.canRedo}>
                                    <RedoIcon/>
                                </IconButton>
                                <ToolbarSeparator style={styles.separator}/>
                                <IconButton
                                    onClick={this.save.bind(this)}
                                    iconStyle={styles.iconButton}>
                                    <SaveIcon/>
                                </IconButton>
                                <ToolbarSeparator style={styles.separator}/>
                                <IconButton
                                    onClick={this.clear.bind(this)}
                                    iconStyle={styles.iconButton}>
                                    <ClearIcon/>
                                </IconButton>
                            </AppBar>
                        </div>
                    </div>

                    {
                        this.state.middleOut ?
                            <div className={"my-carousel"} style={{height:1400}}>
                                <Carousel
                                    images = {this.state.renderedImages}
                                    autoplay={200}
                                    loop={true}
                                    lazyLoad={false}
                                />
                            </div>
                            :
                            null
                    }

                    <br/>
                    <div className='row' style={{marginLeft: "auto", marginRight: "auto"}}>
                        <div style={{ boxShadow: '5px 7px #555', marginLeft: "auto", marginRight: "auto", border: '1px solid gray', height: '1000px', width: '1000px', borderColor: 'black'}}>
                            <SketchField
                                ref={(c) => this._sketch = c}
                                width='1000px'
                                height='1000px'
                                tool={this.state.tool}
                                lineColor={this.state.penColor}
                                lineWidth={this.state.lineWidth}
                                imageFormat="png"
                                onChange={this.onSketchChange.bind(this)}
                            />
                        </div>
                    </div>

                    <div className = 'row' style={{marginLeft: 'auto', marginRight: 'auto', textAlign: 'center'}}>
                        <IconButton
                            onClick={this.prev.bind(this)}
                            iconStyle={{width:'42px', height: '42px', fill: 'black'}}>
                            <LeftIcon/>
                        </IconButton>
                        <span style={{fontSize: 36, fontWeight: 'bold', textAlign: 'right'}}> {this.state.index+1}</span>
                        <IconButton
                            onClick={this.next.bind(this)}
                            iconStyle={{width:'42px', height: '42px', fill: 'black'}}>
                            <RightIcon/>
                        </IconButton>
                    </div>

                    <br/>

                    <Card style={{margin: '10px 10px 5px 0'}}>

                        <CardText expandable={false} style={{backgroundColor:'#8fbbff'}}>
                            <label htmlFor='tool' style={{color:'white', fontSize:24, fontWeight: 'bold'}}>Canvas Tool</label><br/>
                            <SelectField ref='tool' value={this.state.toolName} onChange={this.selectTool.bind(this)} labelStyle={{ color: 'white' }}>
                                <MenuItem value={Tools.Pencil} primaryText={<span style={{fontSize: 20}}>Pencil</span>}/>
                                <MenuItem value={Tools.Line} primaryText={<span style={{fontSize: 20}}>Line</span>}/>
                                <MenuItem value={Tools.Rectangle} primaryText={<span style={{fontSize: 20}}>Rectangle</span>}/>
                                <MenuItem value={Tools.Circle} primaryText={<span style={{fontSize: 20}}>Circle</span>}/>
                                <MenuItem value={Tools.Pan} primaryText={<span style={{fontSize: 20}}>Pan</span>}/>
                                <MenuItem value={"Eraser"} primaryText={<span style={{fontSize: 20}}>Eraser</span>}/>
                            </SelectField>
                            <br/>
                            <br/>
                            <label htmlFor='slider' style={{fontSize:24, color: 'white', fontWeight: 'bold'}}>Line Weight</label>
                            <Slider ref='slider' step={0.1}
                                    defaultValue={this.state.lineWidth / 100}
                                    onChange={(e, v) => this.setState({lineWidth: v * 100})}/>

                        </CardText>
                    </Card>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
