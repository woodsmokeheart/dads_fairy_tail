import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  BookOpen, 
  Heart, 
  Users, 
  Star,
  Sparkles,
  Shield,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'О нас - Папины сказки',
  description: 'Узнайте больше о проекте Папины сказки. Наша миссия - создавать волшебные истории для детей и семей.',
  keywords: 'о нас, папины сказки, детские истории, авторские сказки, семейные ценности',
  alternates: {
    canonical: 'https://dads-fairy-tales.vercel.app/about'
  },
  openGraph: {
    title: 'О нас - Папины сказки',
    description: 'Узнайте больше о проекте Папины сказки. Наша миссия - создавать волшебные истории для детей и семей.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <div>О проекте</div>
            <div className={styles.heroTitleAccent}>Папины сказки</div>
          </h1>
          <p className={styles.heroDescription}>
            Мы создаём волшебный мир, где каждая история становится частью 
            семейных воспоминаний и учит детей добру, мудрости и любви.
          </p>
        </div>
        <div className={styles.backgroundBook}>
          <BookOpen className={styles.bookIcon} />
        </div>
      </section>

      <section className={styles.mission}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Наша миссия</h2>
          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <Heart className={styles.missionIcon} />
              <h3>Семейные ценности</h3>
              <p>
                Мы верим в силу семейных традиций и создаём истории, 
                которые объединяют поколения и укрепляют семейные связи.
              </p>
            </div>
            <div className={styles.missionCard}>
              <Sparkles className={styles.missionIcon} />
              <h3>Волшебство для детей</h3>
              <p>
                Каждая сказка наполнена магией, которая развивает 
                воображение ребёнка и учит его мечтать.
              </p>
            </div>
            <div className={styles.missionCard}>
              <Shield className={styles.missionIcon} />
              <h3>Безопасный контент</h3>
              <p>
                Все наши истории тщательно проверяются и содержат 
                только добрые, поучительные сюжеты для детей.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Что мы предлагаем</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <BookOpen className={styles.featureIcon} />
              <div className={styles.featureContent}>
                <h3>Авторские сказки</h3>
                <p>
                  Уникальные истории, написанные специально для наших читателей, 
                  с учётом возраста и интересов детей.
                </p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <Users className={styles.featureIcon} />
              <div className={styles.featureContent}>
                <h3>Сообщество авторов</h3>
                <p>
                  Возможность стать частью творческого сообщества и 
                  делиться своими историями с другими семьями.
                </p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <Clock className={styles.featureIcon} />
              <div className={styles.featureContent}>
                <h3>Время чтения</h3>
                <p>
                  Каждая сказка рассчитана на оптимальное время чтения 
                  перед сном - от 5 до 15 минут.
                </p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <Star className={styles.featureIcon} />
              <div className={styles.featureContent}>
                <h3>Качественный контент</h3>
                <p>
                  Все истории проходят модерацию и соответствуют 
                  высоким стандартам детской литературы.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.principles}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Наши принципы</h2>
          <div className={styles.principlesList}>
            <div className={styles.principle}>
              <div className={styles.principleNumber}>01</div>
              <div className={styles.principleContent}>
                <h3>Доброта превыше всего</h3>
                <p>
                  Каждая история учит детей быть добрыми, отзывчивыми 
                  и помогать тем, кто в этом нуждается.
                </p>
              </div>
            </div>
            <div className={styles.principle}>
              <div className={styles.principleNumber}>02</div>
              <div className={styles.principleContent}>
                <h3>Семейные традиции</h3>
                <p>
                  Мы поддерживаем традицию семейного чтения и 
                  создаём истории, которые объединяют семью.
                </p>
              </div>
            </div>
            <div className={styles.principle}>
              <div className={styles.principleNumber}>03</div>
              <div className={styles.principleContent}>
                <h3>Развитие воображения</h3>
                <p>
                  Наши сказки развивают творческое мышление и 
                  помогают детям мечтать и фантазировать.
                </p>
              </div>
            </div>
            <div className={styles.principle}>
              <div className={styles.principleNumber}>04</div>
              <div className={styles.principleContent}>
                <h3>Образовательная ценность</h3>
                <p>
                  Каждая история содержит поучительный элемент, 
                  который помогает детям расти и развиваться.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Присоединяйтесь к нашему миру сказок!
          </h2>
          <p className={styles.ctaDescription}>
            Читайте наши истории, создавайте свои собственные сказки 
            и делитесь волшебством с близкими.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/">
              <Button variant="primary" size="large">
                Читать сказки
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="primary" size="large">
                Стать автором
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
