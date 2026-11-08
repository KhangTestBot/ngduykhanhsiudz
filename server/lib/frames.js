// Danh mục khung viền và cấu hình Photobooth NgDuyKhanh VIP
const FRAME_CATALOG = {
    // 1. Khung Tiện Ích Độc Quyền NgDuyKhanh
    "loopy_3d_vip": {
        name: "Khung Loopy 3D VIP",
        type: "single",
        overlayUrl: "https://i.ibb.co/Tq8wqjyD/code-gen-ff0e345.png"
    },
    "shin_chan_vip": {
        name: "Khung Shin-chan VIP",
        type: "single",
        overlayUrl: "https://i.ibb.co/1Yt1Dzzy/Shin-chan-1.png"
    },
    "hello_kitty_vip": {
        name: "Khung Hello Kitty VIP",
        type: "single",
        overlayUrl: "https://i.ibb.co/RTm5P1n9/kitty-1.png"
    },

    // 2. Các Khung Photobooth 4 Ô Liên Hoàn
    "photobooth_4cut": {
        name: "Photobooth 4 Ô Cổ Điển",
        type: "photobooth_4",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/photobooth_4cut.png"
    },
    "photobooth_cute": {
        name: "Photobooth Cute Pastel",
        type: "photobooth_4",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/photobooth_cute.png"
    },
    "frame_berry_days": {
        name: "Photobooth Berry Days",
        type: "photobooth_4",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_strawberry.png"
    },
    "frame_happy_snap": {
        name: "Photobooth Happy Snap",
        type: "photobooth_4",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_vintage.png"
    },
    "frame_sky_diary": {
        name: "Photobooth Sky Diary",
        type: "photobooth_4",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_galaxy.png"
    },
    "pb_holo_4cut": {
        name: "Photobooth Y2K Holo",
        type: "photobooth_4",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_holo_4cut.png"
    },
    "pb_scrapbook_ripped_4cut": {
        name: "Photobooth Scrapbook",
        type: "photobooth_4",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png"
    },
    "pb_ripped_paper_4cut": {
        name: "Photobooth Ripped Paper",
        type: "photobooth_4",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_ripped_paper_4cut.png"
    },
    "pb_denim_ripped_2x2": {
        name: "Photobooth Denim 2x2",
        type: "photobooth_4",
        layout: "grid_2x2",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_denim_ripped_2x2.png"
    }
};

function getFrameConfig(filterId) {
    if (!filterId) return null;
    const lower = String(filterId).toLowerCase();
    if (FRAME_CATALOG[lower]) return FRAME_CATALOG[lower];

    // Nhận diện tự động qua từ khóa
    if (/photobooth|4cut|berry|happy_snap|sky_diary|holo_4cut|scrapbook/i.test(lower)) {
        return {
            name: "Photobooth 4 Ô Tự Động",
            type: "photobooth_4",
            overlayUrl: null
        };
    }
    return null;
}

module.exports = {
    FRAME_CATALOG,
    getFrameConfig
};
