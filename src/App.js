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
        selectionColor: 'white'
    },
});

class App extends Component {
    state = {
        tool: Tools.Pencil,
        lineWidth: 5,
        drawings: [],
        canUndo: false,
        canRedo: false,
        index: 0,
        totalFrames:1,
        currentFrame:null,
    };

    selectTool (even, index, value) {
        this.setState({
            tool: value
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
        if (drawings[index]) drawings[index] = this._sketch;
        else drawings.push(this._sketch);

        this.setState({drawings: drawings});
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
        console.log("next");
        this.save();
        this.clear();

        let index = this.state.index;
        let totalFrames = this.state.totalFrames;
        if (index+1===totalFrames) {
            totalFrames++;
            index++;
        } else {
            index++;
        }

        console.log(index);
        console.log(totalFrames);
        this.setState({
            index: index,
            totalFrames: totalFrames,
        });
        if (index < this.state.drawings.length && this.state.drawings[index])
            this._sketch.addImg('https://upload.wikimedia.org/wikipedia/commons/6/66/Android_robot.png');

    }

    prev() {
        let index = this.state.index;
        let totalFrames = this.state.totalFrames;
        if (index !== 0) {
            console.log("prev");
            this.save();
            this.clear();
            index--;
            console.log(index);
            console.log(totalFrames);
            if (index < this.state.drawings.length && this.state.drawings[index]);
                this._sketch.addImg('https://upload.wikimedia.org/wikipedia/commons/6/66/Android_robot.png');
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
                            <AppBar title={<span style={{fontSize: 36, fontWeight: 'bold'}}>Pie Piper</span>} showMenuIconButton={false} style={styles.appBar}>
                                <button
                                    onClick={()=>console.log("middle out!")}
                                    style={{alignSelf: 'center', height: 36, borderRadius:5, color: 'white', outline: 'none', borderColor:'#8fbbff'}}
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

                    <br/>
                    <div className='row' style={{marginLeft: "auto", marginRight: "auto"}}>
                        <div style={{boxShadow: '5px 7px #555', marginLeft: "auto", marginRight: "auto", border: '1px solid gray', height: '1000px', width: '1000px', borderColor: 'black'}}>
                            <SketchField
                                ref={(c) => this._sketch = c}
                                width='1000px'
                                height='1000px'
                                tool={this.state.tool}
                                lineColor='black'
                                lineWidth={this.state.lineWidth}
                                imageFormat="jpeg"
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
                        <text style={{fontSize: 36, fontWeight: 'bold', textAlign: 'right'}}> {this.state.index+1}</text>
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
                            <SelectField ref='tool' value={this.state.tool} onChange={this.selectTool.bind(this)} labelStyle={{ color: 'white' }}>
                                <MenuItem value={Tools.Select} primaryText={<span style={{fontSize: 20}}>Select</span>}/>
                                <MenuItem value={Tools.Pencil} primaryText={<span style={{fontSize: 20}}>Pencil</span>}/>
                                <MenuItem value={Tools.Line} primaryText={<span style={{fontSize: 20}}>Line</span>}/>
                                <MenuItem value={Tools.Rectangle} primaryText={<span style={{fontSize: 20}}>Rectangle</span>}/>
                                <MenuItem value={Tools.Circle} primaryText={<span style={{fontSize: 20}}>Circle</span>}/>
                                <MenuItem value={Tools.Pan} primaryText={<span style={{fontSize: 20}}>Pan</span>}/>
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
