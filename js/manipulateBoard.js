(function() {
    
    //var TransformManager = {} //obiekt stanu transformacji planszy
    //motyw jest dobry:) - obiekt zawiera przeksztalcenia ktore beda podlegaly zlozeniu do przeksztalcenia wynikowego - to juz jest dobre, ale to nie wszystko :)
    //dodatkowo trzeba generowac animacje juz w trakcie dzialania, w zaleznosci od aktualnej transformacji obiektu, tzreba np dodac obroty tej aktualnej transformacji - podoba mi sie to :)
    //obiekt powinien miec metode, ktroa w latwy sposob wykonuje zlozenie transformacji w oparciu o to, ktore sa wlaczone
    
    //transformacje:
    //obroty, skalowanie, rzut 3d, perspektywa, widok normlany, perspective origin, translacja x y x
    //animacje:
    //obroty, rzut 3d, widok normlany
    
    var TransformManager = {
      translateX: '',  
      tx: 0,
      translateY: '',  
      ty: 0,
      translateZ: '',  
      tz:0,
      
      rotate2d: '',
      rotationPos: 0,
      
      scale: '',
      sx: 1,
      sy: 1,
      
      perspective: 0,
      rx: 0,
      SCALE_X: 0.7,
      SCALE_Y: 0.5,
      _3dView: '',
      
      needUpdateRotateAnim : false,
      needUpdate3DAnim : false,
      anims: [],
      styleSheet: document.styleSheets[1],
      board: board,

      setTranslateX : function() {
        this.translateX = ' translateX(' + this.tx + 'px) ';
        this.needUpdateRotateAnim = true;
        this.needUpdate3DAnim = true;
      },
      setTranslateY : function() {
        this.translateY = ' translateY(' + this.ty + 'px) ';
        this.needUpdateRotateAnim = true;
        this.needUpdate3DAnim = true;
      },
      setTranslateZ : function(z) {
        this.translateZ = ' translateZ(' + this.tz + 'px) ';
        this.needUpdateRotateAnim = true;
        this.needUpdate3DAnim = true;
      },
      addTranslateX : function(x) {
          this.tx += x;
          this.setTranslateX();
      },
      addTranslateY : function(y) {
          this.ty += y;
          this.setTranslateY();
      },
      addTranslateZ : function(z) {
          this.tz += z;
          this.setTranslateZ();
      },
      setRotate2d : function() { //ustawiamy rotację w zaleznosci od ratationPos
        var r = 0;
        if(this.rotationPos === 1) {
            r = 90;
        } else if (this.rotationPos === 2) {
            r = 180;
        } else if (this.rotationPos === 3) {
            r = 270;
        } else if (this.rotationPos === -1) {
            r = 270;
        } else if (this.rotationPos === -2) {
            r = 180;
        } else if (this.rotationPos === -3) {
            r = 90;
        }
        
        this.rotate2d = ' rotate(' + r + 'deg) ';
        this.needUpdate3DAnim = true;
      },
      addScaleX : function(sx) {
        this.sx += sx;
        this.setScale();
      },
      addScaleY : function(sy) {
        this.sy += sy;
        this.setScale();
      },
      setScale : function() {
        this.scale = ' scale(' + this.sx + ', ' + this.sy + ') ';
        this.needUpdateRotateAnim = true;
        this.needUpdate3DAnim = true;
      },
      setRotateX: function(rx) {
          this.rx = rx;
          this.update3DView();
      },
      addRotateX: function(rx) {
          this.rx += rx;
          this.update3DView();
      },
      setPerspective: function(p) {
          this.perspective = p;
          this.update3DView();
      },
      addPerspective: function(p) {
          this.perspective += p;
          this.update3DView();
      },
      clearTransforms: function() {
          this.translateX = '';
          this.translateY = '';
          this.translateZ = '';
          this.tx = 0;
          this.ty = 0;
          this.tz = 0;
          
          this.scale = '';
          this.sx = 1;
          this.sy = 1;
          
          this.rotate2d = '';
          this.rotationPos = 0;
          
          this._3dView = '';
          this.perspective = 0;
          this.rx = 0;
          
          this.needUpdate3DAnim = false;
          this.needUpdateRotateAnim = false;
          
          this.delAnimsFromStyleSheet();
          this.genRotationAnims(); 
          this.gen3DViewAnim();
          this.addAnimsToStyleSheet();
      },
      update3DView : function() {
        this._3dView = ' perspective('+ this.perspective + 'px) rotateX(' + this.rx + 'deg) '  + ' scale(' + this.SCALE_X + ', ' + this.SCALE_Y + ') ';
        this.needUpdateRotateAnim = true;
      },
      getTransform: function() {//pobranie finalnej transformacji
        return  this._3dView + this.translateX + this.translateY + this.translateZ +  this.rotate2d + this.scale ;
      },
      setTransform: function() {
        this.board.style.transform =   this.getTransform();
      },
      updateAnims: function() { //glowna metoda uzywana do odswiezania animacji 
        if(this.needUpdateRotateAnim === true) { //jesli porzeba aktualizacji animacji obrotu, to aktualizujemy wszystko - 1 aktualizacja wiecej nas nie robi
            this.needUpdateRotateAnim = false;
            this.needUpdate3DAnim= false;
            
            this.delAnimsFromStyleSheet();
            this.genRotationAnims(); //zawsze animacje rotacji maja byc w tablicy i w arkuszu przed animacja widoku 3d
            this.gen3DViewAnim();
            this.addAnimsToStyleSheet();
        }
        if(this.needUpdate3DAnim === true) {
            this.needUpdate3DAnim = false;
            this.anims.pop();//usuwam zbedna animacje 3d
            this.styleSheet.deleteRule(this.styleSheet.cssRules.length-1); //usuwam tą animacje rowniez z arkusza stylu
            
            this.gen3DViewAnim();//genereuje nowa animację
            this.styleSheet.insertRule(this.anims[8].text, this.styleSheet.cssRules.length);// dodaję animację do arkusza   
        }
      }, 
      delAnimsFromStyleSheet: function () {
        for(var i = 0; i < this.anims.length; i++) {
            this.styleSheet.deleteRule(this.styleSheet.cssRules.length-1);  
        }
        this.anims.length = 0;
      },
      genRotatationAnim: function(name, transformFrom, transformAfter, scaleTo, rotateFrom, rotateTo, percFrom, percTo) {
        var obj = {};
        obj.text = '@keyframes ' + name + ' {'
                + '0% {transform: '  + transformFrom +  ' rotate(' + rotateFrom + 'deg) ' + transformAfter + ' } '
                +  percFrom + '% {transform: '  + transformFrom +  ' scale(' + scaleTo + ',' + scaleTo + ') rotate(' + rotateFrom + 'deg) ' + transformAfter + ' } '
                +  percTo + '% {transform: '  + transformFrom +  ' scale(' + scaleTo + ',' + scaleTo + ') rotate(' + rotateTo + 'deg) ' + transformAfter + ' } '
                + '100% {transform: '  + transformFrom +  ' rotate(' + rotateTo + 'deg) ' + transformAfter + ' } '
                + '}';  
        return obj;
      },
      genRotationAnims : function() {
        var scaleTo = 0.7;
        var percFrom = 30;
        var percTo = 70;
        var transform1 = this._3dView + this.translateX + this.translateY + this.translateZ ;
        var transform2 = this.scale ;

        this.anims.push(this.genRotatationAnim('rotate_board_R_0', transform1, transform2, scaleTo, 270, 360, percFrom, percTo));
        this.anims.push(this.genRotatationAnim('rotate_board_R_1', transform1, transform2, scaleTo, 0, 90, percFrom, percTo));
        this.anims.push(this.genRotatationAnim('rotate_board_R_2', transform1, transform2, scaleTo, 90, 180, percFrom, percTo));
        this.anims.push(this.genRotatationAnim('rotate_board_R_3', transform1, transform2, scaleTo, 180, 270, percFrom, percTo));
        
        this.anims.push(this.genRotatationAnim('rotate_board_L_0', transform1, transform2, scaleTo, -270, -360, percFrom, percTo));
        this.anims.push(this.genRotatationAnim('rotate_board_L_1', transform1, transform2, scaleTo, 0, -90, percFrom, percTo));
        this.anims.push(this.genRotatationAnim('rotate_board_L_2', transform1, transform2, scaleTo, -90, -180, percFrom, percTo));
        this.anims.push(this.genRotatationAnim('rotate_board_L_3', transform1, transform2, scaleTo, -180, -270, percFrom, percTo));
      },
      gen3DViewAnim: function() { //naprawic, zeby w razie gdy nic nie ma do dodania 
          var obj = {};
          var transform1 = '';
          var transform2 = this.translateX + this.translateY + this.translateZ + this.rotate2d + this.scale;
          var fill = '';
          if((transform1 + transform2 + this._3dView).trim() === '') {
              fill = 'perspective(400px) rotateX(0deg)';
          }
          obj.text = '@keyframes _3d_view_anim {'  
                  + '0% {transform: ' + transform1 + ' perspective(400px) rotateX(0deg)' +  transform2 + ' } '      
                  + '100% {transform: ' + transform1 + this._3dView + transform2 + fill +  ' } '      
                  + '}';
          
          this.anims.push(obj);
          
      },
      addAnimsToStyleSheet: function() {
        for(var i = 0; i < this.anims.length; i++) {
            this.styleSheet.insertRule(this.anims[i].text, this.styleSheet.cssRules.length);   
        }
      },
      initAnims: function() {
          this.genRotationAnims(); 
          this.gen3DViewAnim();
          this.addAnimsToStyleSheet();
      }
    }
    
    // inicjalizacja animacji poczatkowych
    TransformManager.initAnims();
    
    
    button_rotate_right.addEventListener('click', buttonRotateRAction, false);
    button_rotate_left.addEventListener('click', buttonRotateLAction, false);
    
    function buttonRotateRAction(e) {
        if(TransformManager.rotationPos === -2) {
            TransformManager.rotationPos = 3;
        } else if(TransformManager.rotationPos === -3) {
            TransformManager.rotationPos = 2;
        }
        else {
            TransformManager.rotationPos++;
            TransformManager.rotationPos %= 4;
        }
        TransformManager.setRotate2d();
        TransformManager.updateAnims();
        board.style.animation =  'rotate_board_R_' + TransformManager.rotationPos + ' 2s';
        board.style.transform = TransformManager.getTransform();
        
        //console.log(TransformManager.anims[TransformManager.rotationPos].text);
    }
    function buttonRotateLAction(e) {
        if(TransformManager.rotationPos === 3) {
            TransformManager.rotationPos = -2;
        } else if(TransformManager.rotationPos === 2) {
            TransformManager.rotationPos = -3;
        }
        else {
            TransformManager.rotationPos--;
            TransformManager.rotationPos %= 4;
        }
        TransformManager.setRotate2d();
        TransformManager.updateAnims();
        board.style.animation =  'rotate_board_L_' + (-1*TransformManager.rotationPos) + ' 2s';
        board.style.transform = TransformManager.getTransform();
        
        //console.log(TransformManager.anims[4 + (-1*TransformManager.rotationPos)].text);
    }
    
    //przycisk animacji przejscia w widok 3d planszy
    button3D.addEventListener('click', button3DAction, false);
   
    function button3DAction(e) {
        TransformManager.setPerspective(800);
        TransformManager.setRotateX(30);
        TransformManager.updateAnims();
        board.style.animation = '_3d_view_anim 3s';
        board.style.transform = TransformManager.getTransform();
    }
    
    buttonClear.addEventListener('click', buttonClearAction, false);
   
    function buttonClearAction(e) {
        TransformManager.clearTransforms();
        board.style.transform = TransformManager.getTransform();
    }
    
    buttonTXminus.addEventListener('click', buttonTXminusAction, false);
    buttonTYminus.addEventListener('click', buttonTYminusAction, false);
    buttonTZminus.addEventListener('click', buttonTZminusAction, false);
    buttonSXminus.addEventListener('click', buttonSXminusAction, false);
    buttonSYminus.addEventListener('click', buttonSYminusAction, false);
    buttonRXminus.addEventListener('click', buttonRXminusAction, false);
    buttonPminus.addEventListener('click', buttonPminusAction, false);
    
    buttonTXplus.addEventListener('click', buttonTXplusAction, false);
    buttonTYplus.addEventListener('click', buttonTYplusAction, false);
    buttonTZplus.addEventListener('click', buttonTZplusAction, false);
    buttonSXplus.addEventListener('click', buttonSXplusAction, false);
    buttonSYplus.addEventListener('click', buttonSYplusAction, false);
    buttonRXplus.addEventListener('click', buttonRXplusAction, false);
    buttonPplus.addEventListener('click', buttonPplusAction, false);
    
    
    var tx = 20;
    var ty = 20;
    var tz = 20;
    var sx = 0.05;
    var sy = 0.05;
    var p = 100;
    var rx = 5;
    
    function buttonTXminusAction() {
        TransformManager.addTranslateX(-tx);
        TransformManager.setTransform();
    }
    function buttonTXplusAction() {
        TransformManager.addTranslateX(tx);
        TransformManager.setTransform();
    }
    function buttonTYminusAction() {
        TransformManager.addTranslateY(-ty);
        TransformManager.setTransform();
    }
    function buttonTYplusAction() {
        TransformManager.addTranslateY(ty);
        TransformManager.setTransform();
    }
    function buttonTZminusAction() {
        TransformManager.addTranslateZ(-tz);
        TransformManager.setTransform();
    }
    function buttonTZplusAction() {
        TransformManager.addTranslateZ(tz);
        TransformManager.setTransform();
    }
    function buttonSXminusAction() {
        TransformManager.addScaleX(-sx);
        TransformManager.setTransform();
    }
    function buttonSXplusAction() {
        TransformManager.addScaleX(sx);
        TransformManager.setTransform();
    }
    function buttonSYminusAction() {
        TransformManager.addScaleY(-sy);
        TransformManager.setTransform();
    }
    function buttonSYplusAction() {
        TransformManager.addScaleY(sy);
        TransformManager.setTransform();
    }
    function buttonRXminusAction() {
        TransformManager.addRotateX(-rx);
        TransformManager.setTransform();
    }
    function buttonRXplusAction() {
        TransformManager.addRotateX(rx);
        TransformManager.setTransform();
    }
    function buttonPminusAction() {
        TransformManager.addPerspective(-p);
        TransformManager.setTransform();
    }
    function buttonPplusAction() {
        TransformManager.addPerspective(p);
        TransformManager.setTransform();
    }
    
    
    /* --------------------- UI effects --------------------- */
    
    //znikanie belki nazwy panelu po najechaniu na dowolne miejsce panelu
    panel_right.addEventListener('mouseenter', function(e) {
        panel_name.style.opacity = '0';
        panel_name.style.left = '-50px';
        panel_name.style.transition = 'opacity 1s, left 1s';
    }, false);
    panel_right.addEventListener('mouseleave', function(e) {
        panel_name.style.opacity = '1';
        panel_name.style.left = '0px';
        panel_name.style.transition = 'opacity 1s 2s, left 1s 2s';
    }, false);
    
})()
