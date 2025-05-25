import { useRef, useEffect } from "react";

export default function Preloader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cn = canvasRef.current;
    if (!cn) return;
    // Явно указываем тип
    const gl = (cn.getContext("webgl") || cn.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    let animationFrameId: number;

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 avp;
      void main() {
        gl_Position = vec4(avp, 0.0, 1.0);
      }
    `;

    // Fragment shader (твой код)
    const fragmentShaderSource = `
      precision highp float;
      const float pi = 3.14159265359;
      uniform float uTime;
      uniform vec2 uResolution;

      float rand(float seed) {
          return fract(sin(seed) * 10000.);
      }
      float noise(vec2 p) {
          return rand(p.x * 14. + p.y * sin(uTime / 1500000.) * .005);
      }
      float smoothNoise(vec2 p){
          vec2 inter = smoothstep(0., 1., fract(p));
          float s = mix(noise(vec2(floor(p.x), floor(p.y))), noise(vec2(ceil(p.x), floor(p.y))), inter.x);
          float n = mix(noise(vec2(floor(p.x), ceil(p.y))), noise(vec2(ceil(p.x), ceil(p.y))), inter.x);
          return mix(s, n, inter.y);
      }
      float fbm(in vec2 p) {
          float z = 2.;
          float rz = 0.;
          for (float i = 1.; i < 6.; i++) {
              rz += abs((smoothNoise(p) - .5) * 2.) / z;
              z *= 2.;
              p *= 2.;
          }
          return rz;
      }

      float circ(vec2 p){
          float r = length(p);
          r = log(sqrt(r));
          return abs(mod(4.*r, pi*2.) - pi) * 3. + .2;
      }

      void main() {
          vec2 p = gl_FragCoord.xy / uResolution.xy - 0.5;
          p.x *= uResolution.x / uResolution.y;
          float rz = fbm(p * 5.);
          rz *= circ(p / exp(mod(uTime / 500., pi)));
          gl_FragColor = vec4(vec3(.4, .3, .7) / rz, 1.);
      }
    `;

    function compileShader(gl: WebGLRenderingContext, source: string, type: number) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
      const vs = compileShader(gl, vsSource, gl.VERTEX_SHADER);
      const fs = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
      if (!vs || !fs) return null;
      const program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return null;
      }
      return program;
    }

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    if (!program) return;

    const resolutionLocation = gl.getUniformLocation(program, "uResolution");
    const timeLocation = gl.getUniformLocation(program, "uTime");
    const vertexPositionLocation = gl.getAttribLocation(program, "avp");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    function resize() {
      if (!canvasRef.current || !gl) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      gl.viewport(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    resize();
    window.addEventListener("resize", resize);

    const startTime = Date.now();

    function render() {
      if (!canvasRef.current || !gl) return;
      gl.useProgram(program);
      gl.enableVertexAttribArray(vertexPositionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(vertexPositionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeLocation, Date.now() - startTime);
      gl.uniform2f(resolutionLocation, canvasRef.current.width, canvasRef.current.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ width: "100vw", height: "100vh", display: "block" }} />
  );
}
