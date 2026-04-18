import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TextBookDocument, TextBook } from 'schemas/textBooks.schema';

@Injectable()
export class BookSeeder {
    constructor(@InjectModel(TextBook.name) private textBookModel: Model<TextBookDocument>) { }

    async seed() {
        const count = await this.textBookModel.countDocuments();
        if (count > 0) return; // already seeded

        const textBooks = [
            {
                title: 'اضطراب الحركه ',
                author: 'Ammar waled',
                description: 'الع ـالقة بين اضطراب املعالجة الحسية وصعوبات التعلم النمائي ـة لدى األطفال املصابين بفرط الحركة ونقص االنتبـاه  ADHD',
                cover: 'https://apis.takweenkw.com/Attachments/book//2025032323728283967.jpeg',
                link: 'https://sero.journals.ekb.eg/article_443467_22b6e584bb16f4229187f8dd9c1a563d.pdf'

            },
            {
                title: 'اضطراب الحركه ',
                author: 'Ammar waled',
                description: 'الع ـالقة بين اضطراب املعالجة الحسية وصعوبات التعلم النمائي ـة لدى األطفال املصابين بفرط الحركة ونقص االنتبـاه  ADHD',
                cover: 'https://apis.takweenkw.com/Attachments/book//2025032323728283967.jpeg',
                link: 'https://ejcj.journals.ekb.eg/article_336087_d037d7484857d9209f2b5d4754cb048c.pdf'

            },
            {
                title: 'اضطراب الحركه ',
                author: 'Ammar waled',
                description: 'الع ـالقة بين اضطراب املعالجة الحسية وصعوبات التعلم النمائي ـة لدى األطفال املصابين بفرط الحركة ونقص االنتبـاه  ADHD',
                cover: 'https://apis.takweenkw.com/Attachments/book//2025032323728283967.jpeg',
                link: 'https://search.shamaa.org/PDF/Articles/EGIjcte/IjcteVol8No13Y2022/ijcte_2022-v8-n13_129-157.pdf'

            },
            {
                title: 'اضطراب الحركه ',
                author: 'Ammar waled',
                description: 'الع ـالقة بين اضطراب املعالجة الحسية وصعوبات التعلم النمائي ـة لدى األطفال املصابين بفرط الحركة ونقص االنتبـاه  ADHD',
                cover: 'https://apis.takweenkw.com/Attachments/book//2025032323728283967.jpeg',
                link: 'https://search.shamaa.org/PDF/Articles/EGAjqe/AjqeVol4No14Y2020/ajqe_2020-v4-n14_293-315.pdf'

            },

        ];

        await this.textBookModel.insertMany(textBooks);
        console.log('Books seeded!');
    }
}