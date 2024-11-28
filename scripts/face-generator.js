let FaceGen = {
    hairColors: ['#000000', '#4B3621', "#FFD700", "#FF4500", "#0000FF", "#008000", "#FFC0CB", "#800080", "#FFFFFF", "#808080", "#C0C0C0", "#FFA500", "#008080"],
    eyesColors: ["#000000", "#4B3621", "#0000FF", "#008000", "#FF0000", "#FFD700", "#C0C0C0", "#800080", "#FFC0CB", "#808080", "#FFFF00", "#FFA500", "#008080"],
    male: {
        hairCount: 2,
        backHairCount: 1,
        hair: 0,
        backHair: 0,
        hairColor: 0,
        eyesColor: 0,
        count: [2, 1, FaceGen.hairColors.length, FaceGen.eyesColors.length],
        current: [0, 0, 0, 0]

    },
    female: {
        hairCount: 5,
        backHairCount: 6,
        currentHair: 0,
        currentBackHair: 0,
        hairColor: 0,
        eyesColor: 0,
        count: [5, 6, FaceGen.hairColors.length, FaceGen.eyesColors.length],
        current: [0, 0, 0, 0]
    },
    gender: 'male',
};

FaceGen.create= function(size, gender, values) {
        let list = [];
        if (gender == 'famale') list.push({
            url: `character/${gender}.backhair.${values[1]+1}.png`,
            overlay: values[2]
        });
        list.push({
            url: `character/${gender}.eyes.png`,
            overlay: values[3]
        });
        list.push(`character/${gender}.face.png`);
        list.push({
            url: `character/${gender}.hair.${values[0]+1}.png`,
            overlay: values[2]
        });

        return IconGen.create(size, null, list, `display:block;margin:auto;`);
    }
   FaceGen.createControls= function() {
        FaceGen.createControl('hair', 'male', 0, 0);
        FaceGen.createControl('hairColor', 'male', 1, 2);
        FaceGen.createControl('eyesColor', 'male', 2, 3);
        FaceGen.createControl('hair', 'female', 3, 0);
    }
  FaceGen.createControl= function(type, gender, index, typeInt) {
        let StyleArea = document.getElementById(`style-area-div-${index}`);
        StyleArea.innerHTML = '';
        for (let i = 0; i < FaceGen[gender].count[typeInt]; i++) {
            let button = document.createElement('button');
            button.style = `flex-shrink: 0;width: 60px;height: 60px;padding: 5px;border: 1px solid #ccc;border-radius: 5px;background-color: white;cursor: pointer;transition: all 0.3s;display: flex;align-items: center;justify-content: center;`;
            let values = FaceGen[gender].current.slice();
            values[typeInt] = i;
            if (FaceGen[gender].current[typeInt] == i) button.style.border = '2px solid #3b82f6';
            button.innerHTML = FaceGen.create(50, gender, values);
            button.setAttribute('onclick', `FaceGen.change('${gender}','${typeInt}',${i});`);
            StyleArea.appendChild(button);
        }
    }
  FaceGen.change= function(gender, type, i) {
        FaceGen[gender].current[type] = i;
        document.getElementById('face').innerHTML = FaceGen.create(300, gender, FaceGen[gender].current);
        FaceGen.createControls();
    }
    FaceGen.changeGender= function(s) {
        FaceGen.gender = s.toLowerCase();
        document.getElementById('face').innerHTML = FaceGen.getCurrentSVG();
        FaceGen.createControls();
    }
   FaceGen.getCurrentSVG= function() {
        return FaceGen.create(300, FaceGen.gender, FaceGen[FaceGen.gender].current);
    }
    FaceGen.showSection: function(type) {
        let Styles = FaceGen.getStyleAreas();
        let num = 4;
        if (type === 'Hair')
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
    }
   FaceGen.getInputControls function() {
        return {
            type: 'custom',
            id: 'face',
            html: FaceGen.getCurrentSVG()
        }, {
            type: 'switch',
            id: 'style',
            label: 'Style',
            options: ['Hair', 'Back Hair', 'Hair Color', 'Eye Color'],
            action: FaceGen.showSection
        }, {
            type: 'custom',
            id: 'faceButtons',
            html: FaceGen.getScrollAreaDivs(),
            callback: function() {
                FaceGen.createControls();
                FaceGen.showSection()
            }
        }, {
            type: 'switch',
            id: 'gender',
            label: 'Gender',
            options: ['Male', 'Female'],
            action: FaceGen.changeGender
        };
    }
    FaceGen.getStyleAreas= function() {
        let list = [];
        for (let i = 0; i < 7; i++) {
            list.push(document.getElementById(`style-area-div-${i}`));
        }
        return list;
    }
    FaceGen.getScrollAreaDivs= function() {
        let s = '';
        for (let i = 0; i < 7; i++) {
            s += `<div class="scroll-area" id="style-area-div-${i}"></div>`;
        }
        return s;
    }

