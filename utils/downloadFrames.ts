import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export async function downloadFrames(dataUrlList: Array<string>) {
    console.info("Архивация...");
    console.time("Архивация завершена");
    const zip = new JSZip();
    zip.file("_towebm.bat",
        "ffmpeg -framerate 60 -i frame-%%04d.png -c:v libvpx-vp9 -b:v 0 -crf 0 -pass 1 -an -f webm NULL\n" +
        "ffmpeg -framerate 60 -i frame-%%04d.png -c:v libvpx-vp9 -b:v 0 -crf 23 -pass 2 -c:a libopus _result.webm");
    for (let i = 0, length = dataUrlList.length - 1; i < length; i++) {
        const n = `${i}`.padStart(4, '0');
        zip.file(`frame-${n}.png`, dataUrlList[i].replace(/^data:image\/(png|jpg);base64,/, ""), {base64: true});
    }
    const content = await zip.generateAsync({type: "blob"});
    console.timeEnd("Архивация завершена");
    console.log("Скачивание архива...");
    console.time("Скачивание архива завершено");
    saveAs(content, "frames.zip");
    console.timeEnd("Скачивание архива завершено");
}
