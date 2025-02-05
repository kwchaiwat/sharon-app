import { Category } from '../types/game';

export const categories: Category[] = [
  {
    id: 'sports',
    title: 'กีฬา',
    subCategories: [
      {
        id: 'ball-sports',
        title: 'กีฬาที่ใช้ลูกบอล',
        words: ['ฟุตบอล', 'บาสเกตบอล', 'วอลเลย์บอล', 'เทนนิส', 'แบดมินตัน']
      },
      {
        id: 'martial-arts',
        title: 'ศิลปะการต่อสู้',
        words: ['มวยไทย', 'คาราเต้', 'เทควันโด', 'ยูโด', 'มวยสากล']
      }
    ]
  },
  {
    id: 'animals',
    title: 'สัตว์',
    subCategories: [
      {
        id: 'mammals',
        title: 'สัตว์เลี้ยงลูกด้วยนม',
        words: ['สิงโต', 'เสือ', 'ช้าง', 'ม้า', 'วัว']
      },
      {
        id: 'birds',
        title: 'นก',
        words: ['นกอินทรี', 'นกแก้ว', 'นกกระจอก', 'นกเป็ดน้ำ', 'นกยูง']
      }
    ]
  }
]; 