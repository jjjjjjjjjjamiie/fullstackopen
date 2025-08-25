const App = () => {
  const twoSum = ((nums: number[], target: number): number[] => {
    const numsMap = new Map<number, number>()
    let output: number[] = []

    nums.forEach((num, index) => {
      const complement = target - num
      if (numsMap.has(complement)) {
        output = [numsMap.get(complement)!, index]
      }
      numsMap.set(num, index)
    })
    return output
  })

  const romanNumerals = ((s: string): number => {
    const romans: { [key: string]: number } = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000
    }

    let total = 0

    for (let i = 0; i < s.length; i++) {
      const current = romans[s[i]]
      const next = romans[s[i + 1]]

      if (next && current < next) {
        total -= current
      } else {
        total += current
      }
    }

    return total
  })

  const palindrome = ((n: number): boolean => n.toString() === n.toString().split('').reverse().join(''))

  const roman = (s: string): number => {
    const romans: { [key: string]: number } = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000
    }

    let total = 0

    for (let i = 0; i < s.length; i++) {
      const current = romans[s[i]]
      console.log('current', current)
      const next = romans[s[i + 1]]
      console.log('next', next)
      if (next && next > current) {
        total -= current
      } else {
        total += current
      }
    }

    return total
  }

const palindromeda = (num: number): boolean => {
  const b = num.toString() === num.toString().split('').reverse().join('');
    console.log(b)
  return b
  }

  return (
      <>
    <div>
      {palindromeda(12345687778654321)}
    </div>
      </>
  )

}


export default App
