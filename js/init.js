(function(){
    
    var BoardSize = {};//obiekt przechowujacy rozmiary elementow planszy - nizej przykladowe wartosci
    BoardSize.width = 1303;//2*170 + 9 * 107
    BoardSize.height = 802;//2*104 + 9 * 66
    BoardSize.cornerX = 170;
    BoardSize.cornerY = 104;
    BoardSize.horizontalX = 107;
    BoardSize.horizontalY = 104;
    BoardSize.verticalX = 170;
    BoardSize.verticalY = 66;
    BoardSize.innerY = 594;//wysokosc 9 pol wertykalnych - bok prostokata wewnatrz planszy
    BoardSize.innerX = 963;//dlugosc 9 pol horyzontalnych - bok prostokata wewnatrz planszy
    
    
    //kazdemu elementowi html pola planszy przypisuje wlasciwosc left lub top wlasciwą jemu by nastepnie od niej odemjmowac okreslona ilosc razy - robie to jako cwiczenie
    //metoda ponizej jest cwiczebna, nie wykorzystana w aplikacji
    function placeFieldsUsingCSS() { //przypisanie z wykorzystaniem arkusza stylu css
        var line1Elements = board.getElementsByClassName('line1');
        var line2Elements = board.getElementsByClassName('line2');
        var line3Elements = board.getElementsByClassName('line3');
        var line4Elements = board.getElementsByClassName('line4');
        
        var cssLine1;
        var cssLine2;
        var cssLine3;
        var cssLine4;
        var style = document.styleSheets[0];
        for(var i = 0; i < style.cssRules.length; i++) {
            if(style.cssRules[i].selectorText === '.line1') 
                cssLine1 = style.cssRules[i];
            if(style.cssRules[i].selectorText === '.line2') 
                cssLine2 = style.cssRules[i];
            if(style.cssRules[i].selectorText === '.line3') 
                cssLine3 = style.cssRules[i];
            if(style.cssRules[i].selectorText === '.line4') 
                cssLine4 = style.cssRules[i];
        }
        for(var i = 0; i < 9; i++) {
            line1Elements.item(i).style.left = cssLine1.style.left;
            line2Elements.item(i).style.top = cssLine2.style.top;
            line3Elements.item(i).style.left = cssLine3.style.left;
            line4Elements.item(i).style.top = cssLine4.style.top;
        }
        
        for(var i = 0; i < 9; i++) {
            var line1Val = parseInt(line1Elements.item(i).style.left);
            line1Val -= i * BoardSize.horizontalX;
            line1Elements.item(i).style.left = line1Val + 'px';
            
            var line2Val = parseInt(line2Elements.item(i).style.top);
            line2Val -= i * BoardSize.verticalY;
            line2Elements.item(i).style.top = line2Val + 'px';
            
            var line3Val = parseInt(line3Elements.item(i).style.left);
            line3Val += i * BoardSize.horizontalX;
            line3Elements.item(i).style.left = line3Val + 'px';
            
            var line4Val = parseInt(line4Elements.item(i).style.top);
            line4Val += i * BoardSize.verticalY;
            line4Elements.item(i).style.top = line4Val + 'px';
        }
    }
    
    //nadac dla board odpowiednie width i height
    //inner board w,h, top, left
    //f0,f10,f20,f30, line1-line4
    
    function readCSS() {
        var style = document.styleSheets[0];
        
        //pobranie wartosci numerycznych
        BoardSize.cornerX = parseInt(style.cssRules[0].style.width);
        BoardSize.cornerY = parseInt(style.cssRules[0].style.height);
        BoardSize.horizontalX = parseInt(style.cssRules[1].style.width);
        BoardSize.horizontalY = parseInt(style.cssRules[1].style.height);
        BoardSize.verticalX = parseInt(style.cssRules[2].style.width);
        BoardSize.verticalY = parseInt(style.cssRules[2].style.height);
        
        BoardSize.width = (2*BoardSize.cornerX + 9*BoardSize.horizontalX);
        BoardSize.height = (2*BoardSize.cornerY + 9*BoardSize.verticalX);
        BoardSize.innerX = (9*BoardSize.horizontalX);
        BoardSize.innerY = (9*BoardSize.verticalX);
        
        //wartosci tekstowe + px
        BoardSize.cornerXpx = BoardSize.cornerX + 'px';
        BoardSize.cornerYpx = BoardSize.cornerY + 'px';
        BoardSize.horizontalXpx = BoardSize.horizontalX + 'px';
        BoardSize.horizontalYpx = BoardSize.horizontalY + 'px';
        BoardSize.verticalXpx = BoardSize.verticalX + 'px';
        BoardSize.verticalYpx = BoardSize.verticalY + 'px';
        
        BoardSize.widthpx = BoardSize.width + 'px';
        BoardSize.heightpx = BoardSize.height + 'px';
        BoardSize.innerXpx = BoardSize.innerX + 'px';
        BoardSize.innerYpx = BoardSize.innerY + 'px';
        
        console.log(BoardSize);
    }
    
    function buildElements() {
        board.style.width = BoardSize.widthpx;
        board.style.height = BoardSize.heightpx;
        inner_board.style.width = BoardSize.innerXpx;
        inner_board.style.height = BoardSize.innerYpx;
        
        for(var i = 1; i < 30; i++) {//pola planszy - horyzontalne
            if(i === 10)
                i = 21;
            board.children[('f' + i).toString()].style.width = BoardSize.horizontalXpx;
            board.children[('f' + i).toString()].style.height = BoardSize.horizontalYpx;
        }
        for(var i = 11; i < 40; i++) {//pola wertykalne
            if(i === 20)
                i = 31;
            board.children[('f' + i).toString()].style.width = BoardSize.verticalXpx;
            board.children[('f' + i).toString()].style.height = BoardSize.verticalYpx;
        }
        for(var i = 0; i < 40; i += 10) {//narozniki
            board.children[('f' + i).toString()].style.width = BoardSize.cornerXpx;
            board.children[('f' + i).toString()].style.height = BoardSize.cornerYpx;
        }
    }
    
    function placeElements() {
        //pobranie obiektu glownego stylu css
        var style = document.styleSheets[0];
        //umieszczanie pol naroznych
        f0.style.top = (BoardSize.height - BoardSize.cornerY).toString() + 'px';
        f0.style.left = (BoardSize.width - BoardSize.cornerX).toString() + 'px';
        f10.style.top = (BoardSize.height - BoardSize.cornerY).toString() + 'px';
        f30.style.left = (BoardSize.width - BoardSize.cornerX).toString() + 'px';

        //rotacje pol naroznych
        /*
        f10.style.transform = 'rotate(90deg) translateY(' + BoardSize.cornerYpx + ')';//tutaj niepotrzebnie kombinowalem z transform-origin, bo tylko sobie utrudnilem ;p
        f20.style.transform = 'rotate(90deg) translateY(' + BoardSize.cornerYpx + ')';
        f30.style.transform = 'rotate(180deg) translateY(' + BoardSize.cornerYpx + ')' + ' translateX(' + BoardSize.cornerXpx + ')';
        */

        //umieszczenie pola wewnatrz
        inner_board.style.top = BoardSize.cornerYpx;
        inner_board.style.left = BoardSize.cornerXpx;
        
        //line1
        //style.insertRule('.line1 {top:' + (BoardSize.height - BoardSize.cornerY) + 'px;}', style.cssRules.length);//wzor prosty, jesli zmienimy proporcje pol planszy, dla ciekwaszego efektu mozna zastosowac ponizszy styl
        style.insertRule('.line1 {top:' + (BoardSize.height - BoardSize.cornerY + (BoardSize.cornerY - BoardSize.horizontalY)/2) + 'px;}', style.cssRules.length);
        for(var i = 1; i < 10; i++) {
            board.children['f' + i].style.left = BoardSize.width - BoardSize.cornerX - i*BoardSize.horizontalX + 'px';
            //board.children['f' + i].style.top = BoardSize.height - BoardSize.cornerY + 'px';//tutaj lepiej dodac regule do arkusza css zamiast kazdemu elementowi ustawiac taka sama wartosc
        }
        
        //line2
        //style.insertRule('.line2 {left:' + (BoardSize.cornerXpx) + ';}', style.cssRules.length);
        style.insertRule('.line2 {left:' + (BoardSize.cornerX - (BoardSize.cornerX - BoardSize.verticalY)/2) + 'px;}', style.cssRules.length);
        var b = 10;
        for(var i = 1; i < 10; i++) {
            //board.children['f' + (i+b)].style.left = BoardSize.cornerXpx;
            board.children['f' + (i+b)].style.top = BoardSize.height - BoardSize.cornerY - i*BoardSize.verticalX + 'px';
            //board.children['f' + (i+b)].style.transformOrigin = '0% 0%';//te dwie deklaracje powinny byc w css
            //board.children['f' + (i+b)].style.transform = 'rotate(90deg)';
        }
        //line3
        b = 20;
        //style.insertRule('.line3 {top:' + (BoardSize.cornerYpx) + ';}', style.cssRules.length);
        style.insertRule('.line3 {top:' + (BoardSize.cornerY - (BoardSize.cornerY - BoardSize.horizontalY)/2) + 'px;}', style.cssRules.length);
        style.insertRule('.line3 {transform:' + 'rotate(180deg) translateX(-' + BoardSize.horizontalXpx + ')' + ';}', style.cssRules.length);
        
        for(var i = 1; i < 10; i++) {
            board.children['f' + (i+b)].style.left = BoardSize.cornerX + (i-1)*BoardSize.horizontalX + 'px';
            //board.children['f' + (i+b)].style.top = BoardSize.cornerYpx;
            //board.children['f' + (i+b)].style.transformOrigin = '0% 0%';
            //board.children['f' + (i+b)].style.transform = 'rotate(180deg) translateX(-' + BoardSize.horizontalXpx + ')';//celowo sprawdzam z uzyciem translacji, bo mozna zrobic takze bez 
        }
        //line4
        //style.insertRule('.line4 {left:' + (BoardSize.width - BoardSize.cornerX) + 'px;}', style.cssRules.length);
        style.insertRule('.line4 {left:' + (BoardSize.width - BoardSize.cornerX + (BoardSize.cornerX - BoardSize.verticalY)/2) + 'px;}', style.cssRules.length);
        b = 30;
        for(var i = 1; i < 10; i++) {
            //board.children['f' + (i+b)].style.left = BoardSize.width - BoardSize.cornerX + 'px';
            board.children['f' + (i+b)].style.top = BoardSize.cornerY +  i*BoardSize.verticalX + 'px';
            //board.children['f' + (i+b)].style.transformOrigin = '0% 0%';
            //board.children['f' + (i+b)].style.transform = 'rotate(-90deg)';
        }
    }
    
    function readImages() {
        for(var i = 0; i < 40; i++ ) {
            board.children['f' + i].style.backgroundImage = 'url(\'img/board1/f'  + i +  '.png\')';
            //board.children['f' + i].style.backgroundSize = '100% 100%';//ta deklarcja powinna byc w pliku css
        }
    }
    //transformacje dla linii
    var lineTransform = {line1: [], line2: [], line3: [], line4:[]}
    
    function getLineTransforms() {//kazdemu elementowi klasy field nalezy nadac transform taki jak wynika z jego stylu - powinienem byl tak zrobic wczeniej w kodzie, zeby teraz nie musiec tak robic, ale juz trudno
        var rules = document.styleSheets[0].cssRules;
        
        for(var i = 0; i < rules.length; i++) {
            if(rules.item(i).selectorText === '.line2')
                lineTransform.line2.push(rules.item(i));
            else if(rules.item(i).selectorText === '.line3')
                lineTransform.line3.push(rules.item(i));
            else if(rules.item(i).selectorText === '.line4')
                lineTransform.line4.push(rules.item(i));
        }
        for(var i = 2; i <= 4; i++) {
            lineTransform['line' + i].forEach(function(e) {
            if(e.style.transform !== '')
                lineTransform['line' + i].transform = e.style.transform;
            })
        }
    }
    
    function addLineTransforms() { //dodanie transformacji linii
        
        //modyfikacja transforms, gdyz modifikuje transform-origin z 0 0 na 50 50, wiec musze dodac pewne przeksztalcenia; jesli chce usunac te przeksztalcenia, to zeby dzialalo, musze wrocic transform-origin na 0 0
        lineTransform.line2.transform += ' translateY(' +  BoardSize.verticalY*0.83 + 'px) translateX(-' +  BoardSize.verticalX/4 + 'px)';
        lineTransform.line3.transform += ' translateY(' +  BoardSize.verticalY + 'px) translateX(' +  BoardSize.verticalX + 'px)';
        lineTransform.line4.transform += ' translateY(' +  BoardSize.verticalY*0.17 + 'px) translateX(' +  BoardSize.verticalX*1.25 + 'px)';
        
        
        for(var i = 2; i <= 4; i++) {
            var arr = board.getElementsByClassName('line' + i);
            arr = Array.from(arr);
            arr.forEach(function(e) {
                e.style.transform = lineTransform['line'+i].transform;
            });
        }
        
        lineTransform.line1.transform = ' ';
        
    }
    
    function addFieldEvents() {
        addLineTransforms();
        var fields = board.getElementsByClassName('field');
        fields = Array.from(fields);
        fields.forEach(function(e) {
            e.addEventListener('mouseenter', onEnterField, false);
            e.addEventListener('mouseleave', onLeaveField, false);
        });
    
    }
    function onEnterField(e) {
        e.target.transform = e.target.style.transform;
        //e.target.style.transform += ' scale(1.1, 1.1) ';
        //e.target.style.transform += ' perspective(400px) rotateY(20deg) ';
    }
    function onLeaveField(e) {
        e.target.style.transform = e.target.transform;
    }
    
    function generateAnimations() {//generowanie animacji dla line2, line3, line4 - trzeba dodac aktualne transform obiektow do animacji; uzywane zamiast zwklego efektu transform i skalowania
        var style = document.styleSheets[0];
        
        var rule2 = '@keyframes onenter_effect2 { '
                        + '0% {transform: ' + lineTransform.line2.transform +   ' perspective(400px) rotateY(0deg)} '
                        + '50% {transform: ' + lineTransform.line2.transform +   ' perspective(400px) rotateY(30deg)} '
                        + '100% {transform: ' + lineTransform.line2.transform +   ' perspective(400px) rotateY(0deg) translateZ(20px)} '
                        + ' }';
        style.insertRule(rule2, style.cssRules.length);
        
        var rule3 = '@keyframes onenter_effect3 { '
                        + '0% {transform: ' + lineTransform.line3.transform +   ' perspective(400px) rotateY(0deg)} '
                        + '50% {transform: ' + lineTransform.line3.transform +   ' perspective(400px) rotateY(30deg)} '
                        + '100% {transform: ' + lineTransform.line3.transform +   ' perspective(400px) rotateY(1deg) translateZ(20px)} '
                        + ' }';
        style.insertRule(rule3, style.cssRules.length);
        
        var rule4 = '@keyframes onenter_effect4 { '
                        + '0% {transform: ' + lineTransform.line4.transform +   ' perspective(400px) rotateY(0deg)} '
                        + '50% {transform: ' + lineTransform.line4.transform +   ' perspective(400px) rotateY(30deg)} '
                        + '100% {transform: ' + lineTransform.line4.transform +   ' perspective(400px) rotateY(0deg) translateZ(20px)} '
                        + ' }';
        style.insertRule(rule4, style.cssRules.length);
    }
    
    
    
    function start() {
        readCSS();
        buildElements();
        placeElements();
        readImages();
        getLineTransforms();
        addFieldEvents();
        generateAnimations();
    }
    
    window.init = {start: start};
    
})()
