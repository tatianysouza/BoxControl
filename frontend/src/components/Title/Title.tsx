import styles from "./Title.module.css";

interface TitleProps {
  titulo: string;
}
const Title = ({titulo}:TitleProps) =>{
    return(
        <>
            <h1 className={styles.title}>{titulo}</h1>
        </>
    );
}

export default Title;