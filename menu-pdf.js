(() => {
  const pageWidth = 612;
  const pageHeight = 792;
  const left = 48;
  const right = 564;
  const bottom = 48;

  const clean = value => String(value || '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[^\x20-\x7E]/g, '');

  const escapePdf = value => clean(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

  function textWidth(text, size) {
    return clean(text).length * size * 0.52;
  }

  function wrap(text, width, size) {
    const words = clean(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';

    words.forEach(word => {
      const next = line ? `${line} ${word}` : word;
      if (line && textWidth(next, size) > width) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    });

    if (line) lines.push(line);
    return lines;
  }

  function buildMenuPdf(menu) {
    const pages = [];
    let lines = [];
    let y = 744;

    const add = (text, x, size = 10, font = 'F1') => {
      lines.push(`BT /${font} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${escapePdf(text)}) Tj ET`);
    };

    const divider = () => {
      lines.push(`0.75 w ${left} ${y} m ${right} ${y} l S`);
    };

    const newPage = () => {
      pages.push(lines.join('\n'));
      lines = [];
      y = 744;
      add('Arundel House of Pizza', left, 15, 'F2');
      add('Menu continued', right - 78, 9, 'F1');
      y -= 22;
      divider();
      y -= 18;
    };

    const makeRoom = height => {
      if (y - height < bottom) newPage();
    };

    add('ARUNDEL HOUSE OF PIZZA', left, 21, 'F2');
    y -= 22;
    add('1369 Portland Road, Arundel, Maine 04046', left, 10);
    y -= 14;
    add('207-985-1700  |  arundelhop.com', left, 10);
    y -= 14;
    add('Dine In  |  Carry Out  |  Delivery', left, 10, 'F2');
    y -= 18;
    divider();
    y -= 22;

    menu.forEach(section => {
      makeRoom(54);
      add(section.category.toUpperCase(), left, 15, 'F2');
      y -= 16;

      if (section.note) {
        wrap(section.note, right - left, 9).forEach(line => {
          add(line, left, 9);
          y -= 11;
        });
        y -= 3;
      }

      section.items.forEach(item => {
        const nameLines = wrap(item.name, 355, 10);
        const descriptionLines = item.description ? wrap(item.description, 390, 8) : [];
        const needed = (nameLines.length * 13) + (descriptionLines.length * 10) + 3;
        makeRoom(needed);

        nameLines.forEach((line, index) => {
          add(line, left, 10, 'F2');
          if (index === 0) add(item.price, right - textWidth(item.price, 10), 10, 'F2');
          y -= 13;
        });

        descriptionLines.forEach(line => {
          add(line, left + 8, 8);
          y -= 10;
        });

        y -= 3;
      });

      if (section.extras) {
        makeRoom(34);
        wrap(section.extras, right - left, 8).forEach(line => {
          add(line, left, 8);
          y -= 10;
        });
      }

      y -= 11;
    });

    makeRoom(20);
    divider();
    y -= 15;
    add('Prices and availability are subject to change.', left, 8);
    pages.push(lines.join('\n'));

    return makePdf(pages);
  }

  function makePdf(pageStreams) {
    const objects = [];
    const addObject = value => {
      objects.push(value);
      return objects.length;
    };

    const fontRegular = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    const fontBold = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
    const pagesRef = addObject('');
    const pageRefs = [];

    pageStreams.forEach(stream => {
      const contentRef = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
      const pageRef = addObject(`<< /Type /Page /Parent ${pagesRef} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> /Contents ${contentRef} 0 R >>`);
      pageRefs.push(pageRef);
    });

    objects[pagesRef - 1] = `<< /Type /Pages /Kids [${pageRefs.map(ref => `${ref} 0 R`).join(' ')}] /Count ${pageRefs.length} >>`;
    const catalogRef = addObject(`<< /Type /Catalog /Pages ${pagesRef} 0 R >>`);

    let pdf = '%PDF-1.4\n';
    const offsets = [0];

    objects.forEach((object, index) => {
      offsets.push(pdf.length);
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });

    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach(offset => {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogRef} 0 R >>\nstartxref\n${xref}\n%%EOF`;

    return new TextEncoder().encode(pdf);
  }

  function downloadMenuPdf() {
    const file = buildMenuPdf(window.ahopMenu || []);
    const url = URL.createObjectURL(new Blob([file], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'arundel-house-of-pizza-menu.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  window.ahopMenuPdf = { build: buildMenuPdf, download: downloadMenuPdf };
})();
