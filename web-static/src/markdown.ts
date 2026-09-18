import MarkdownIt from "markdown-it";
import { BASE_URL } from "./config";

// html: false escapa el HTML en crudo que venga en el contenido, asi que no
// hace falta sanear la salida despues: no hay forma de colar etiquetas.
// linkify convierte en enlaces las direcciones escritas a pelo, que es como
// estan en las noticias antiguas.
// breaks respeta los saltos de linea sueltos, para que el texto plano ya
// publicado se siga viendo igual que con el pre-wrap que habia antes.
const md = MarkdownIt({ html: false, linkify: true, breaks: true });

// Pages CMS inserta las imagenes como /media/imagenes/...; en GitHub Pages el
// sitio cuelga de /venialbo-conecta/, asi que las rutas absolutas necesitan el
// prefijo o dan 404.
const conBase = (url: string) =>
  url.startsWith("/") ? `${BASE_URL}${url.replace(/^\//, "")}` : url;

// attrGet declara string | number | null, de ahi el paso por String().
const atributo = (valor: string | number | null): string =>
  valor === null ? "" : String(valor);

const imagenPorDefecto = md.renderer.rules.image!;
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const src = atributo(tokens[idx].attrGet("src"));
  if (src) tokens[idx].attrSet("src", conBase(src));
  return imagenPorDefecto(tokens, idx, options, env, self);
};

const enlacePorDefecto =
  md.renderer.rules.link_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = atributo(tokens[idx].attrGet("href"));
  if (/^https?:\/\//i.test(href)) {
    // Los enlaces externos salen fuera del sitio: pestaña nueva y sin dar
    // acceso al window de origen.
    tokens[idx].attrSet("target", "_blank");
    tokens[idx].attrSet("rel", "noopener noreferrer");
  } else if (href.startsWith("/")) {
    tokens[idx].attrSet("href", conBase(href));
  }
  return enlacePorDefecto(tokens, idx, options, env, self);
};

export const renderMarkdown = (texto?: string | null): string =>
  texto ? md.render(texto) : "";
