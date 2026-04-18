// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Video, VideosDocument } from 'schemas/videos.schema copy';

// @Injectable()
// export class VideoSeeder {
//     constructor(@InjectModel(Video.name) private videoModel: Model<VideosDocument>) { }

//     async seed() {
//         const count = await this.videoModel.countDocuments();
//         if (count > 0) return; // already seeded

//         const  videos = [
//             {
//                 title: "اعراض الاضطرابات الحسية لحاسة اللمس 1",
//                 description: "أعراض الاضطرابات الحسية لحاسة اللمس - تكامل حسيثاني فيديوهات السلسة اللي كنت أعلنت عنها الخاصة بالتكامل الحسي والنفس حركي ",
//                 cover: "https://as2.ftcdn.net/v2/jpg/10/70/02/95/1000_F_1070029591_M7j71rvmvwXmS4CIlAwDYAl9g6pEdFW3.jpg",
//                 link: "https://youtu.be/RQuqTaq9ooE?si=vDKW27WfeBahB3kh",
//                 time: "00:24:00",
//                 views: 1000
//             }
//             ,
//             {
//                 title: "اعراض الاضطرابات الحسية لحاسة اللمس 2",
//                 description: "أعراض الاضطرابات الحسية لحاسة اللمس - تكامل حسيثاني فيديوهات السلسة اللي كنت أعلنت عنها الخاصة بالتكامل الحسي والنفس حركي ",
//                 cover: "https://as2.ftcdn.net/v2/jpg/10/70/02/95/1000_F_1070029591_M7j71rvmvwXmS4CIlAwDYAl9g6pEdFW3.jpg",
//                 link: "https://youtu.be/_it-zard-Rw?si=YRcvdlj82UD1IbZr",
//                 time: "00:24:00",
//                 views: 1000

//             },
//             {
//                 title: "اعراض الاضطرابات الحسية لحاسة اللمس 3",
//                 description: "أعراض الاضطرابات الحسية لحاسة اللمس - تكامل حسيثاني فيديوهات السلسة اللي كنت أعلنت عنها الخاصة بالتكامل الحسي والنفس حركي ",
//                 cover: "https://as2.ftcdn.net/v2/jpg/10/70/02/95/1000_F_1070029591_M7j71rvmvwXmS4CIlAwDYAl9g6pEdFW3.jpg",
//                 link: "https://youtu.be/8DsKO5B5baA?si=h6i3UCjQhTL2uzDU",
//                 time: "00:24:00",
//                 views: 1000

//             },
//             {
//                 title: "اعراض الاضطرابات الحسية لحاسة اللمس 4",
//                 description: "أعراض الاضطرابات الحسية لحاسة اللمس - تكامل حسيثاني فيديوهات السلسة اللي كنت أعلنت عنها الخاصة بالتكامل الحسي والنفس حركي ",
//                 cover: "https://as2.ftcdn.net/v2/jpg/10/70/02/95/1000_F_1070029591_M7j71rvmvwXmS4CIlAwDYAl9g6pEdFW3.jpg",
//                 link: "https://youtu.be/8DsKO5B5baA?si=h6i3UCjQhTL2uzDU",
//                 time: "00:24:00",
//                 views: 1000

//             },
//             {
//                 title: "اعراض الاضطرابات الحسية لحاسة اللمس 5",
//                 description: "أعراض الاضطرابات الحسية لحاسة اللمس - تكامل حسيثاني فيديوهات السلسة اللي كنت أعلنت عنها الخاصة بالتكامل الحسي والنفس حركي ",
//                 cover: "https://as2.ftcdn.net/v2/jpg/10/70/02/95/1000_F_1070029591_M7j71rvmvwXmS4CIlAwDYAl9g6pEdFW3.jpg",
//                 link: "https://youtu.be/8DsKO5B5baA?si=h6i3UCjQhTL2uzDU",
//                 time: "00:24:00",
//                 views: 1000

//             },

//         ];

//         await this.videoModel.insertMany(videos);
//         console.log('videos seeded!');
//     }
// }