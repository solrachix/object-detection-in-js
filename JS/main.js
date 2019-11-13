//USAR NA WEBCAM
class App_webCam extends React.Component {
  // referência ao vídeo e à tela
  videoRef = React.createRef();
  canvasRef = React.createRef();
  heightTela = window.screen.height;
  widthTela = window.screen.width;
  // nós vamos usar o estilo embutido
  styles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    borderRadius: '10px',
  };


  detectFromVideoFrame = (model, video) => {
    model.detect(video).then(predictions => {
      this.showDetections(predictions);

      requestAnimationFrame(() => {
        this.detectFromVideoFrame(model, video);
      });
    }, (error) => {
      alert("Não foi possível iniciar a webcam")
      console.error(error)
    });
  };

  showDetections = predictions => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const font = "24px helvetica";
    ctx.font = font;
    ctx.textBaseline = "top";

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Desenhe a caixa delimitadora.
      ctx.strokeStyle = "#ff4040";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);
      // Desenhe o plano de fundo da etiqueta.
      ctx.fillStyle = "#ff4040";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10);
      // desenhar retângulo superior esquerdo
      ctx.fillRect(x, y, textWidth + 10, textHeight + 10);
      // desenhar retângulo inferior esquerdo
      ctx.fillRect(x, y + height - textHeight, textWidth + 15, textHeight + 10);

      // Desenhe o texto por último para garantir que esteja no topo.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
      ctx.fillText(prediction.score.toFixed(2), x, y + height - textHeight);
    });
  };

  componentDidMount() {

    console.log(this.heightTela);

    if (navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia) {
      // defina uma promessa que será usada para carregar a webcam e ler seus quadros
      const webcamPromise = navigator.mediaDevices
        .getUserMedia({
          // video: {
          //   facingMode: { exact: "environment" }
          // },
          // video: {facingMode: {exact: mode}}
          video: true,
          audio: false,
        })
        .then(stream => {
          // passar o quadro atual para o window.stream
          window.stream = stream;
          // passar o fluxo para o videoRef
          this.videoRef.current.srcObject = stream;

          return new Promise(resolve => {
            this.videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        }, (error) => {
          alert("Não foi possível iniciar a webcam")
          console.error(error)
        });

      // defina uma promessa que será usada para carregar o modelo
      const loadlModelPromise = cocoSsd.load();

      // resolver todas as promessas
      Promise.all([loadlModelPromise, webcamPromise])
        .then(values => {
          this.detectFromVideoFrame(values[0], this.videoRef.current);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  // aqui estamos retornando o quadro de vídeo e a tela para desenhar,
  // então estamos desenhando nosso vídeo "em movimento"
  render() {
    //<h1 className="titulo">Demonstração da detecção de objeto de modelo do TensorFlow.js Coco SSD</h1>
    return (
      <div className="divPrincipal">
        <video
          style={this.styles}
          autoPlay
          muted
          ref={this.videoRef}
          //width="720"
          //height="600"
          //width="90%"
          //height="80%"
          width={Math.round(this.heightTela - (this.heightTela/2))}
          height={Math.round(this.widthTela - (this.widthTela/10))}
        />

        <canvas style={this.styles} ref={this.canvasRef}
          height={Math.round(this.heightTela - (this.heightTela/2))}
          width={Math.round(this.widthTela - (this.widthTela/10))}
        />
      </div>
    );
  }
}
// <canvas className="DesenharQuadrados" style={this.styles} ref={this.canvasRef}/>


//======================================== USAR COM VIDEO PRE-PRONTO ================================================

class App_video extends React.Component {
  // referência ao vídeo e à tela
  videoRef = React.createRef();
  canvasRef = React.createRef();
  thisVideo = document.getElementById('video');
  // nós vamos usar o estilo embutido
  styles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    borderRadius: '10px',
  };


  detectFromVideoFrame = (model, video) => {
    model.detect(video).then(predictions => {
      this.showDetections(predictions);

      requestAnimationFrame(() => {
        this.detectFromVideoFrame(model, video);
      });
    }, (error) => {
      console.log("Não foi possível iniciar a webcam")
      console.error(error)
    });
  };

  showDetections = predictions => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const font = "24px helvetica";
    ctx.font = font;
    ctx.textBaseline = "top";

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Desenhe a caixa delimitadora.
      ctx.strokeStyle = "#ff4040";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);
      // Desenhe o plano de fundo da etiqueta.
      ctx.fillStyle = "#ff4040";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10);
      // desenhar retângulo superior esquerdo
      ctx.fillRect(x, y, textWidth + 10, textHeight + 10);
      // desenhar retângulo inferior esquerdo
      ctx.fillRect(x, y + height - textHeight, textWidth + 15, textHeight + 10);

      // Desenhe o texto por último para garantir que esteja no topo.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
      ctx.fillText(prediction.score.toFixed(2), x, y + height - textHeight);
    });
  };

  componentDidMount() {
      // defina uma promessa que será usada para carregar a webcam e ler seus quadros
       document.getElementById('video').onplay = function()  {

           const videoPromise = document.getElementById('video').captureStream(mediaStream => {
            // stream = document.getElementById('video').captureStream

               //console.log(mediaStream)
               // passar o quadro atual para o window.stream
               window.stream = mediaStream
               // passar o fluxo para o videoRef
               this.videoRef.current.srcObject = mediaStream

               return new Promise(resolve => {
                 this.videoRef.current.onloadedmetadata = () => {
                   resolve()
                 }
               })
             }, (error) => {
                console.log("Não foi possível iniciar o video")
                console.error(error)
              });


           // defina uma promessa que será usada para carregar o modelo
           const loadlModelPromise = cocoSsd.load();
            console.log(videoPromise)
            console.log(loadlModelPromise)
           // resolver todas as promessas
           Promise.all([loadlModelPromise, videoPromise])
             .then(values => {
               this.detectFromVideoFrame(values[0], this.videoRef.current);
             })
             .catch(error => {
               console.error(error);
             });
       }
  }

  // aqui estamos retornando o quadro de vídeo e a tela para desenhar,
  // então estamos desenhando nosso vídeo "em movimento"
  render() {
    //<h1 className="titulo">Demonstração da detecção de objeto de modelo do TensorFlow.js Coco SSD</h1>
    return (
      <div className="divPrincipal">
        <video
          style={this.styles}
          autoPlay
          muted
          ref={this.videoRef}
          width="720"
          height="600"
         	//width="90%"
          	//height="80%"
        />

        <canvas style={this.styles} ref={this.canvasRef}   width="720" height="650"/>
      </div>
    );
  }
}

//========================================= ESCOLHER QUAL RENDERIZAR =================================================
const domContainer = document.querySelector('#root');
ReactDOM.render(React.createElement(App_webCam), domContainer);
