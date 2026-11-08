// Danh mục khung viền và cấu hình Photobooth NgDuyKhanh VIP
const FRAME_CATALOG = {
    // 1. Khung Tiện Ích Độc Quyền NgDuyKhanh
    "loopy_pink_cutie": {
        name: "Khung Bé Loopy Hồng Cutie 🌸",
        type: "single",
        overlayUrl: "/frames/loopy_pink_cutie.png"
    },
    "chiikawa_hachiware": {
        name: "Khung Chiikawa & Hachiware 🐱",
        type: "single",
        overlayUrl: "/frames/chiikawa_hachiware.png"
    },
    "chiikawa_momonga": {
        name: "Khung Chiikawa Momonga 🐿️",
        type: "single",
        overlayUrl: "/frames/chiikawa_momonga.png"
    },
    "crayon_shinchan": {
        name: "Khung Crayon Shin-chan 🖍️",
        type: "single",
        overlayUrl: "/frames/crayon_shinchan.png"
    },
    "loopy_3d_vip": {
        name: "Khung Loopy 3D VIP 💛",
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

    // 2. Các Mẫu Photobooth 4 Ô Trending Độc Quyền Thiết Kế
    "pb_life4cuts_black": {
        name: "Life4Cuts Black Minimalist",
        type: "photobooth_4",
        theme: "life4cuts_black"
    },
    "pb_life4cuts_white": {
        name: "Life4Cuts Pure White",
        type: "photobooth_4",
        theme: "life4cuts_white"
    },
    "pb_coquette_ribbon": {
        name: "Coquette Pink Ribbon 🎀",
        type: "photobooth_4",
        theme: "coquette_ribbon"
    },
    "pb_kodak_35mm_film": {
        name: "Kodak 35mm Film Strip 🎞️",
        type: "photobooth_4",
        theme: "kodak_35mm_film"
    },
    "pb_y2k_silver_chrome": {
        name: "Y2K Cyber Silver Chrome ✦",
        type: "photobooth_4",
        theme: "y2k_silver_chrome"
    },
    "pb_capybara_chill": {
        name: "Capybara Chill Vibes 🍊",
        type: "photobooth_4",
        theme: "capybara_chill"
    },
    "pb_matcha_daisy": {
        name: "Matcha & Daisy Blossom 🌼",
        type: "photobooth_4",
        theme: "matcha_daisy"
    },
    "pb_sunset_peach": {
        name: "Sunset Peach Dream 🌅",
        type: "photobooth_4",
        theme: "sunset_peach"
    },
    "pb_cyber_neon": {
        name: "Cyber Neon Glow ⚡",
        type: "photobooth_4",
        theme: "cyber_neon"
    },
    "pb_heart_pink_love": {
        name: "Sweet Love Valentine 💖",
        type: "photobooth_4",
        theme: "heart_pink_love"
    },

    // 3. Toàn Bộ Các Mẫu Khung Photobooth Cộng Đồng Hot Trend
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
        name: "Photobooth Berry Days 🍓",
        type: "photobooth_4",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_strawberry.png"
    },
    "frame_happy_snap": {
        name: "Photobooth Happy Snap 🌿",
        type: "photobooth_4",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_vintage.png"
    },
    "frame_sky_diary": {
        name: "Photobooth Sky Diary 🌌",
        type: "photobooth_4",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_galaxy.png"
    },
    "pb_holo_4cut": {
        name: "Photobooth Y2K Holo ✨",
        type: "photobooth_4",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_holo_4cut.png"
    },
    "pb_scrapbook_ripped_4cut": {
        name: "Photobooth Scrapbook Ripped",
        type: "photobooth_4",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png"
    },
    "pb_ripped_paper_4cut": {
        name: "Photobooth Ripped Paper",
        type: "photobooth_4",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_ripped_paper_4cut.png"
    },
    "pb_denim_ripped_2x2": {
        name: "Photobooth Denim Ripped 2x2",
        type: "photobooth_4",
        layout: "grid_2x2",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_denim_ripped_2x2.png"
    },
    "frame_classic_pb": {
        name: "Photobooth Classic Strip",
        type: "photobooth_4",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/photoboot.png"
    },

    // 4. Các Mẫu Khung Đơn Hot Trend (Single Frames)
    "khung_hello_kitty_pastel_ng_t_ng_o": {
        name: "Khung Hello Kitty Ngọt Ngào",
        type: "single",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png"
    },
    "khung_hello_kitty_h_ng_pastel": {
        name: "Khung Hello Kitty Hồng Pastel",
        type: "single",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png"
    },
    "khung_nh_n_pastel_vi_n_ren": {
        name: "Khung Nơ Ren Pastel",
        type: "single",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png"
    },
    "khung_nh_hoa_pastel_vi_n_xanh_m_nh": {
        name: "Khung Hoa Viền Xanh Mảnh",
        type: "single",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png"
    },
    "khung_nh_vu_ng_m_ng_nh_n_b_c": {
        name: "Khung Vuông Mạng Nhện Bạc",
        type: "single",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png"
    },
    "khung_kh_ng_gian_xanh_pastel": {
        name: "Khung Vũ Trụ Xanh Pastel",
        type: "single",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png"
    },
    "khung_vu_ng_ng_i_sao_h_ng_pastel": {
        name: "Khung Ngôi Sao Hồng Pastel",
        type: "single",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png"
    },
    "khung_nh_shin_chan_vi_n_m_nh": {
        name: "Khung Shin-chan Viền Mảnh",
        type: "single",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png"
    },
    "khung_anh_o_kitty_v_sao": {
        name: "Khung Áo Kitty & Sao",
        type: "single",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png"
    },
    "khung_xanh_v_tay_sao_v_ng": {
        name: "Khung Xanh Cánh Tay Sao Vàng",
        type: "single",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png"
    },
    "sinh_nh_t_hello_kitty_ho_i_c": {
        name: "Khung Sinh Nhật Hello Kitty",
        type: "single",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/sinh_nh_t_hello_kitty_ho_i_c.png"
    },
    "pb_single_y2k_silver_holo": {
        name: "Khung Đơn Y2K Silver Holo",
        type: "single",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_single_y2k_silver_holo.png"
    },
    "pb_single_denim_ripped": {
        name: "Khung Đơn Denim Ripped",
        type: "single",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_single_denim_ripped.png"
    },
    "pb_single_film_nostalgia": {
        name: "Khung Đơn Film Nostalgia",
        type: "single",
        overlayUrl: "https://locket-vip.mhiep20077.workers.dev/assets/frames/pb_single_film_nostalgia.png"
    }
};

function getFrameConfig(filterId) {
    if (!filterId) return null;
    const lower = String(filterId).toLowerCase();
    if (FRAME_CATALOG[lower]) return FRAME_CATALOG[lower];

    // Nhận diện tự động qua từ khóa
    if (/photobooth|4cut|berry|happy_snap|sky_diary|holo_4cut|scrapbook|film|coquette|matcha|sunset|capybara/i.test(lower)) {
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
