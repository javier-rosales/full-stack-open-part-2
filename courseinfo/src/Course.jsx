const Header = ({course}) => {
    return <h1>{course}</h1>
}
  
const Part = ({name, exercises}) => {
    return (
        <p>
            {name} {exercises}
        </p>
    )
}
  
const Total = ({parts}) => {
    const exercisesList = parts.map(part => part.exercises)
  
    const total = exercisesList.reduce((sum, exercises) => sum + exercises)
  
    return (
        <p>
            <strong>
                Number of exercises {total}
            </strong>
        </p>
    )
}
  
const Content = ({parts}) => {
    return (
        <div>
            {parts.map(part =>
                <Part
                    key={part.id}
                    name={part.name}
                    exercises={part.exercises}
                />
            )}
        </div>
    )
}
  
const Course = ({course}) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default Course