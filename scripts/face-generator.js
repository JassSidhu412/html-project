let ChosenColors= ['#1F1F1F', '#555555', '#ACACAC', '#FAFAFA', '#0000FF', '#169EFF', '#167BFF', '#FFFF00', '#E1FF00', '#FFD000', '#FFA500', '#FFD050', '#FF6E00', '#FF3300', '#FF006A', '#FF0098', '#FF97D5', '#DD00FF', '#F092FF', '#D592FF', '#9000FF', '#37FF00', '#3DA303', '#205900', '#00FFF6', '#5D2500', '#8E5A37', '#BB874B', '#00FFB2'];
   /* //[  '#169EFF', '#167BFF', '#E1FF00', '#FFD000', '#FFA500', '#FFD050', '#FF6E00', '#FF3300', '#FF006A', '#FF0098', '#FF97D5', '#DD00FF','#F092FF', '#D592FF', '#9000FF', '#3DA303', '#205900', '#1F1F1F',  '#555555',  '#ACACAC',  '#FAFAFA',  '#00FFB2'],//['#000000', '#4B3621', "#FFD700", "#FF4500", "#0000FF", "#008000", "#FFC0CB", "#800080", "#FFFFFF", "#808080", "#C0C0C0", "#FFA500", "#008080"],
    eyesColors: ['#1F1F1F', '#555555', '#ACACAC', '#FAFAFA', '#0000FF', '#169EFF', '#167BFF', '#FFFF00', '#E1FF00', '#FFD000', '#FFA500', '#FFD050', '#FF6E00', '#FF3300', '#FF006A', '#FF0098', '#FF97D5', '#DD00FF', '#F092FF', '#D592FF', '#9000FF', '#37FF00', '#3DA303', '#205900', '#00FFF6', '#5D2500', '#8E5A37', '#BB874B', '#00FFB2'],
    //['#131313', '#616161', '#C5C5C5', '#EBEBEB', '#7A5544', '#793D21', '#CB2626', '#CB2686', '#CB26C3', '#8E26CB', '#5226CB', '#2691CB', '#26BDCB', '#26CB9C', '#26CB60', '#00A1FF', '#34CB26', '#8ECB26', '#429F00', '#C5CB26', '#CB9926', '#CB7026', '#FD9F24', '#E8DC00', '#FDD524', '#EEC2FF'],
    //["#000000", "#4B3621", "#0000FF", "#008000", "#FF0000", "#FFD700", "#C0C0C0", "#800080", "#FFC0CB", "#808080", "#FFFF00", "#FFA500", "#008080"]
*/
let FaceGen = {
    hairColors:ChosenColors,
	eyesColors:ChosenColors,
    male: {
        hairCount: 2,
        backHairCount: 1,
        hair: 0,
        backHair: 0,
        hairColor: 0,
        eyesColor: 0,
        count: [2, 1, ChosenColors.length, ChosenColors.length],
        current: [0, 0, 0, 0]

    },
    female: {
        hairCount: 5,
        backHairCount: 6,
        currentHair: 0,
        currentBackHair: 0,
        hairColor: 0,
        eyesColor: 0,
        count: [5, 6, ChosenColors.length, ChosenColors.length],
        current: [0, 0, 0, 0]
    },
    gender: 'male',
    create: function(size, gender, values) {
        let list = [];
        if (gender == 'female') list.push({
            url: `character/${gender}.backhair.${values[1]+1}.png`,
            overlay: FaceGen.hairColors[values[2]]
        });
        list.push({
            url: `character/${gender}.eyes.png`,
            overlay: FaceGen.eyesColors[values[3]]
        });
        list.push(`character/${gender}.face.png`);
        list.push({
            url: `character/${gender}.hair.${values[0]+1}.png`,
            overlay: FaceGen.hairColors[values[2]]
        });

        return IconGen.create(size, null, list, `display:block;margin:auto;`);
    },
    createControls : function() {
        FaceGen.createControl('hair', 'male', 0, 0);
        FaceGen.createControl('hairColor', 'male', 1, 2);
        FaceGen.createControl('eyesColor', 'male', 2, 3);
        FaceGen.createControl('hair', 'female', 3, 0);
        FaceGen.createControl('backHair', 'female', 4, 1);
        FaceGen.createControl('hairColor', 'female', 5, 2);
        FaceGen.createControl('eyesColor', 'female', 6, 3);
    },
    createControl: function(type, gender, index, typeInt) {
        let StyleArea = document.getElementById(`style-area-div-${index}`);
        StyleArea.innerHTML = '';
        for (let i = 0; i < this[gender].count[typeInt]; i++) {
            let button = document.createElement('button');
            button.style = `flex-shrink: 0;width: 60px;height: 60px;padding: 5px;border: 1px solid #ccc;border-radius: 5px;background-color: white;cursor: pointer;transition: all 0.3s;display: flex;align-items: center;justify-content: center;`;
            let values = this[gender].current.slice();
            values[typeInt] = i;
            if (this[gender].current[typeInt] == i) button.style.border = '2px solid #3b82f6';
            button.innerHTML = FaceGen.create(50, gender, values);
            button.setAttribute('onclick', `FaceGen.change('${gender}','${typeInt}',${i});`);
            StyleArea.appendChild(button);
        }
    },
    change: function(gender, type, i) {
        this[gender].current[type] = i;
        InputBox.Result.values = this[FaceGen.gender].current.slice();
        InputBox.Result.gender = FaceGen.gender;
        document.getElementById('face').innerHTML = FaceGen.create(300, gender, this[gender].current);
        FaceGen.createControls();
    },
    changeGender: function(s) {
        FaceGen.gender = s.split('-')[0];
        document.getElementById('face').innerHTML = FaceGen.getCurrentSVG();
        InputBox.changeSwitch('style', 'hair-option');
        FaceGen.showSection('hair-option');
        //FaceGen.createControls();
        //document.getElementById('hair-option').onclick();
        //if(FaceGen.gender=='male') FaceGen.showSection(0);
        //else FaceGen.showSection(3);
    },
    getCurrentSVG: function() {
        InputBox.Result.values = this[FaceGen.gender].current.slice();
        InputBox.Result.gender = FaceGen.gender;
        return FaceGen.create(300, FaceGen.gender, this[FaceGen.gender].current);
    },
    showSection: function(type) {
        let Styles = FaceGen.getStyleAreas();
        let num = 4;
        if (FaceGen.gender == 'female') document.getElementById('back-hair-option').style.display = 'inline-block';
        else document.getElementById('back-hair-option').style.display = 'none';
        if (type === 'hair-option')
            if (FaceGen.gender == 'female') num = 3;
            else num = 0;
        else if (type === 'Hair Color')
            if (FaceGen.gender == 'female') num = 5;
            else num = 1;
        else if (type === 'Eye Color')
            if (FaceGen.gender == 'female') num = 6;
            else num = 2;
        for (let i = 0; i < 7; i++) {
            if (num != i) Styles[i].style.display = 'none';
            else Styles[i].style.display = 'flex';
        }
    },
    getInputControls: function() {
        return [{
            type: 'custom',
            id: 'face',
            html: FaceGen.getCurrentSVG()
        }, {
            type: 'switch',
            id: 'style',
            label: 'Style',
            options: [{
                id: 'hair-option',
                text: 'Hair'
            }, {
                id: 'back-hair-option',
                text: 'Back Hair'
            }, 'Hair Color', 'Eye Color'],
            action: FaceGen.showSection
        }, {
            type: 'custom',
            id: 'faceButtons',
            html: FaceGen.getScrollAreaDivs(),
            callback: function() {
                FaceGen.createControls();
                //changeSwitch('gender',FaceGen.gender+'-option');
                FaceGen.changeGender(FaceGen.gender);
            }
        }, {
            type: 'switch',
            id: 'gender-option',
            label: 'Gender',
            options: [{
                text: 'Male',
                id: 'male-option'
            }, {
                text: 'Female',
                id: 'female-option'
            }],
            default: FaceGen.gender == 'male' ? 0 : 1,
            action: FaceGen.changeGender
        }];
    },
    getStyleAreas: function() {
        let list = [];
        for (let i = 0; i < 7; i++) {
            list.push(document.getElementById(`style-area-div-${i}`));
        }
        return list;
    },
    getScrollAreaDivs: function() {
        let s = '';
        for (let i = 0; i < 7; i++) {
            s += `<div class="scroll-area" id="style-area-div-${i}"></div>`;
        }
        return s;
    }
};
